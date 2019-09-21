import { isArray } from "util";
import Post from "../models/Post";
import { handleErrors, toObject } from "../../util/utils";
import {
  GET_POST_ERROR,
  POST_NOT_FOUND,
  INVALID_RATING,
  POST_POST_ERROR,
  GET_POSTS_ERROR,
  GET_TAGS_ERROR,
  GET_NOTIFICATIONS_ERROR
} from "../types";
import Rating from "../models/Rating";
import FollowedList from "../models/FollowedList";

const tiers = [0.7, 0.4, -1];
const limits = [1, 16, 28];

export function getPost(req, res) {
  const userId = res.locals && res.locals.user ? res.locals.user.id : null;
  const { _id } = req.params;
  let post = {};

  Post.findById(_id)
    .exec()
    .then(p => {
      if (!p)
        return Promise.reject({
          error: { id: { message: "No post with this id!" } }
        });

      post = p._doc;
      return Rating.findOne({ post: _id, user: userId }).select('value').exec();
    })
    .then(rating => res.json({ ...post, rated: rating ? rating.value : 0 }))
    .catch(e => res.json(handleErrors(GET_POST_ERROR, e)));
}

export function getPosts(req, res) {
  const userId = res.locals && res.locals.user ? res.locals.user.id : null;
  let posts = {};
  let offset = 0; // offset is used for filling in above tier posts if there weren't enough
  const criteria = req.params
    ? req.params.userId
      ? { postedByName: req.params.userId }
      : req.params.tags
      ? {
          tags: {
            $in: isArray(req.params.tags) ? req.params.tags : [req.params.tags]
          }
        }
      : null
    : null;

  getDBPosts(criteria, 0, [], offset)
    .then(postsFromDB => {
      posts = {
        ids: postsFromDB.map(p => p._id),
        ...toObject(postsFromDB, "_id")
      };
      offset = getOffset(postsFromDB.length, offset, 0);
      return getDBPosts(criteria, 1, posts.ids, offset);
    })
    .then(postsFromDB => {
      posts = {
        ...posts,
        ...toObject(postsFromDB, "_id"),
        ids: [...posts.ids, ...postsFromDB.map(post => post._id)]
      };
      offset = getOffset(postsFromDB.length, posts.ids, offset);

      return getDBPosts(criteria, 2, posts.ids, offset);
    })
    .then(postsFromDB => {
      posts = {
        ...posts,
        ...toObject(postsFromDB, "_id"),
        ids: [
          ...posts.ids,
          ...postsFromDB.map(post => post._id),
          ...new Array(
            limits.reduce((a, v) => a + v) - posts.ids.length - postsFromDB.length
          )
            .fill("")
            .map(_ => makeId())
        ]
      };

      if (posts.ids.length > 0 && userId)
        return Rating.find({ user: userId })
          .in("post", posts.ids.filter(id => id.length !== 20))
          .exec();
      return;
    })
    .then(ratings => {
      if (ratings) ratings.forEach(rating => (posts[rating.post].rated = rating.value));

      return res.json(posts);
    })
    .catch(e => res.json(handleErrors(GET_POSTS_ERROR, e)));
}

// Search the db for posts that's in one of the 3 rating tiers and not already chosen,
// then choose randomly from them
const getDBPosts = (c, t, ids, offset) => {
  let match = { _id: { $nin: ids }, ratio: { $gt: tiers[t] } };
  if (c) match = { ...match, ...c };

  return Post.aggregate()
    .match(match)
    .sample(limits[t] + offset)
    .exec()
    .then(p => p)
    .catch(e => e);
};

const getOffset = (length, offset, tier) => offset + limits[tier] - length;

export function getNotifications(req, res) {
  const { skip = 0 } = req.params;
  const userId = res.locals.user.id;

  FollowedList.find({ from: userId })
    .exec()
    .then(follows =>
      follows.length == 0
        ? false
        : Post.find()
            .in("postedById", follows.map(f => f.to))
            .sort("-data")
            .skip(Number(skip))
            .limit(20)
            .lean()
            .exec()
    )
    .then(posts =>
      res.json(
        posts
          ? { ...toObject(posts, "_id"), ids: posts.map(p => p._id) }
          : { ids: [] }
      )
    )
    .catch(e => res.json(handleErrors(GET_NOTIFICATIONS_ERROR, e)));
}

const makeId = () => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 20; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

export function postRating(req, res) {
  const { _id, rating } = req.body;
  const userId = res.locals.user.id;
  let increment = 1;
  let post = {};

  if (![-1, 1].includes(rating))
    return res.json(
      handleErrors(INVALID_RATING, {
        errors: { message: "ratings should be 1 or -1 not " + rating }
      })
    );

  Post.findById(_id)
    .exec()
    .then(p => {
      if (!p)
        return Promise.reject({
          errors: { message: { id: "No post with this id!" } }
        });
      post = p;
      return Rating.findOne({ post: _id, user: userId })
        .select("value")
        .exec();
    })
    .then(r => {
      if (r) {
        if (r.value === rating) {
          increment = -1;
          return Rating.deleteOne({ _id: r._id }).exec();
        } else if (r.value !== rating) {
          post[rating > 0 ? "downs" : "ups"]--;
          r.value *= -1;

          return r.save();
        }
      }

      const newRating = new Rating({ post: _id, user: userId, value: rating });

      return newRating.save();
    })
    .then(() => {
      post[rating < 0 ? "downs" : "ups"] += increment;
      post.ratio = getRating(post.ups, post.ups + post.downs);

      return post.save();
    })
    .then(() => res.json({ status: "Success!" }))
    .catch(e => res.json(handleErrors(POST_NOT_FOUND, e)));
}

// Maybe randomize them? Or select them according to some ranking? Both?
export function getTags(req, res) {
  return Post.aggregate()
    .unwind("$tags")
    .group({ _id: null, tags: { $addToSet: "$tags" } })
    .project({ tags: { $slice: ["$tags", 100] } })
    .exec()
    .then(tags => res.json(tags.length > 0 ? tags[0].tags : []))
    .catch(e => res.json(handleErrors(GET_TAGS_ERROR, e)));
}

export function postPost(req, res) {
  const tags =
    !req.body.tags ||
    !req.body.tags.includes(",") ||
    req.body.tags.split(",").filter(t => t.replace(/\//g, "")).length < 3
      ? "You should give the post at least 3 tags (seperated by commas)!"
      : req.body.tags.split(",").map(t =>
          t
            .toLowerCase()
            .trim()
            .replace(/\//g, "")
        );
  const userId = res.locals.user.id;
  const displayName = res.locals.user.displayName;
  const link = `http${
    req.body.link.includes("https://") ? "s" : ""
  }://www.${req.body.link
    .replace("http://", "")
    .replace("https://", "")
    .replace("www.", "")}`;

  const newPost = new Post({
    description: req.body.description,
    comments: 0,
    downs: 0,
    link: link,
    images: req.body.images,
    postedById: userId,
    postedByName: displayName,
    ratio: getRating(0, 0),
    tags: tags,
    title: req.body.title,
    ups: 0
  });

  newPost
    .save()
    .then(r => res.json(r))
    .catch(e => res.json(handleErrors(POST_POST_ERROR, e)));
}

// Node.js implementation of Evan Miller's algorithm for ranking stuff based on upvotes:
// http://www.evanmiller.org/how-not-to-sort-by-average-rating.html
// https://medium.com/@gattermeier/calculating-better-rating-scores-for-things-voted-on-7fa3f632c79d
const getRating = (upvotes, n = 0, confidence = 0.95) => {
  if (n === 0) return 0;

  const z = 1.96; // probit(1 - (1 - confidence) / 2)
  const phat = (1.0 * upvotes) / n;

  return (
    (phat +
      (z * z) / (2 * n) -
      z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * n)) / n)) /
    (1 + (z * z) / n)
  );
};
