import { Request, Response, NextFunction } from "express"
import { isArray } from "util"
import Post, { PostModel } from "../models/Post"
import { toObject, setErrorType, setResponseData } from "../../utils"
import {
  GET_POST_ERROR,
  POST_NOT_FOUND,
  INVALID_RATING,
  POST_POST_ERROR,
  GET_POSTS_ERROR,
  GET_TAGS_ERROR,
  GET_NOTIFICATIONS_ERROR,
} from "../types"
import { Rating, RatingType } from "../models/Rating"
import FollowList, { FollowListModel } from "../models/FollowList"
import { GetPostsData, GetPostData } from "../../../app/contexts/PostsContext"
import { PostSubmitData } from "src/app/Post/Submit"

const tiers = [0.7, 0.4, -1]
const limits = [1, 16, 28]

interface CriteriaTag {
  tags: {
    $in: string[]
  }
}
interface CriteriaPostedBy {
  postedByName: string
}

const getPost = async (req: Request, res: Response) => {
  setErrorType(res, "GET_POST")
  const idUser = res.locals?.user?.id
  const id = req.params?.id

  const post: PostModel = await Post.findById(id).lean().exec()
  const { _id, _v, ...postWithout_id } = post

  if (!post) throw Error("POST_NOT_FOUND")

  const rating = await Rating.findOne({ idPost: id, idUser })
    .select("value")
    .lean()
    .exec()
  const responseData: GetPostData = {
    post: {
      ...postWithout_id,
      ...(rating ? { rating: rating.value } : { rating: 0 }),
      id: _id,
    },
  }

  setResponseData(res, responseData)
}

const getCriteria = (params: {
  idUser?: string
  tags?: string | string[]
}): CriteriaTag | CriteriaPostedBy | undefined => {
  const { idUser, tags } = params

  return idUser
    ? { postedByName: idUser }
    : tags
    ? {
        tags: {
          $in: isArray(tags) ? tags : [tags],
        },
      }
    : undefined
}

const getPosts = async (req: Request, res: Response) => {
  interface Posts {
    posts: PostModel[]
    ids: string[]
  }

  setErrorType(res, "GET_POSTS")

  const idUser = res.locals?.user?.id
  const criteria = getCriteria(req.params)
  const mergePosts = async (posts: Posts, tier: number, offset: number) => {
    if (tier === 3) return posts

    const newPosts = await getDBPosts(tier, posts.ids, offset, criteria)
    const newOffset = getOffset(newPosts.length, offset, tier)

    return mergePosts(
      {
        posts: [...posts.posts, ...newPosts],
        ids: [...posts.ids, ...newPosts.map(post => post._id)],
      },
      tier + 1,
      newOffset
    )
  }

  const { posts, ids }: Posts = await mergePosts({ posts: [], ids: [] }, 0, 0)
  const ratings: RatingType[] | null =
    idUser && posts.length > 0
      ? await Rating.find({ idUser }).in("idPost", ids).exec()
      : null
  const postsWithRatings = posts.map(post => {
    const rating = ratings?.find(rating => rating.idPost === post._id)

    return { ...post, rating: rating?.value ?? 0 }
  })
  const responseData: GetPostsData = {
    posts: postsWithRatings.map(post => {
      const { _id, _v, ...postWithout_id } = post

      return {
        ...postWithout_id,
        id: _id,
      }
    }),
  }

  setResponseData(res, responseData)
}

// Search the db for posts that's in one of the 3 rating tiers and not already chosen,
// then choose randomly from them
const getDBPosts = async (
  tier: number,
  ids: string[],
  offset: number,
  criteria?: CriteriaPostedBy | CriteriaTag
): Promise<PostModel[]> => {
  const match = { _id: { $nin: ids }, ratio: { $gt: tiers[tier] } }
  const matchWithCriteria = {
    ...match,
    ...(criteria ? criteria : {}),
  }

  return await Post.aggregate()
    .match(matchWithCriteria)
    .sample(limits[tier] + offset)
    .exec()
}

const getOffset = (length: number, offset: number, tier: number) =>
  offset + limits[tier] - length

const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  setErrorType(res, "GET_NOTIFICATIONS_ERROR")
  const { skip = 0 } = req.params
  const idUser = req.user?.id

  const followList: FollowListModel[] = await FollowList.find({ idUser })
    .lean()
    .exec()

  if (!followList) {
    setResponseData(res, { posts: [] })
    next()
  }

  const posts: PostModel[] = await Post.where("idUser")
    .in(followList.map(followItem => followItem.idTarget))
    .sort("-createdAt")
    .skip(Number(skip))
    .limit(20)
    .lean()
    .exec()

  if (!posts.length) {
    setResponseData(res, { posts: [] })
    next()
  }

  const ratings: RatingType[] = await Rating.find({ idUser })
    .in(
      "idPost",
      posts.map(post => post._id)
    )
    .lean()
    .exec()
  const postsWithRatings = posts.map(post => {
    const rating = ratings?.find(rating => rating.idPost === post._id)
    const { _id, _v, ...postWithout_id } = post

    return { ...postWithout_id, rating: rating?.value ?? 0, id: _id }
  })
  const responseData: GetPostsData = {
    posts: postsWithRatings,
  }

  setResponseData(res, responseData)
}

const postRating = (req, res) => {
  const { _id, rating } = req.body
  const userId = res.locals.user.id
  let increment = 1
  let post = {}

  // if (![-1, 1].includes(rating))
  //   return res.json(
  //     handleErrors(INVALID_RATING, {
  //       errors: { message: "ratings should be 1 or -1 not " + rating }
  //     })
  //   );

  Post.findById(_id)
    .exec()
    .then(p => {
      if (!p)
        return Promise.reject({
          errors: { message: { id: "No post with this id!" } },
        })
      post = p
      return Rating.findOne({ post: _id, user: userId }).select("value").exec()
    })
    .then(r => {
      if (r) {
        if (r.value === rating) {
          increment = -1
          return Rating.deleteOne({ _id: r._id }).exec()
        } else if (r.value !== rating) {
          post[rating > 0 ? "downs" : "ups"]--
          r.value *= -1

          return r.save()
        }
      }

      const newRating = new Rating({ post: _id, user: userId, value: rating })

      return newRating.save()
    })
    .then(() => {
      // post[rating < 0 ? "downs" : "ups"] += increment;
      // post.ratio = getRating(post.ups, post.ups + post.downs);
      // return post.save();
    })
    .then(() => res.json({ status: "Success!" }))
  // .catch(e => res.json(handleErrors(POST_NOT_FOUND, e)));
}

// Maybe randomize them? Or select them according to some ranking? Both?
const getTags = async (req: Request, res: Response) => {
  setErrorType(res, "GET_TAGS")

  const [{ tags }]: [{ tags: string[] }] = await Post.aggregate()
    .unwind("$tags")
    .group({ _id: null, tags: { $addToSet: "$tags" } })
    .project({ tags: { $slice: ["$tags", 100] } })
    .exec()

  setResponseData(res, { tags })
}

const postPost = async (req: Request, res: Response, next: NextFunction) => {
  setErrorType(res, "POST_POST_ERROR")
  const tags =
    req.body.tags?.split(",").filter(tag => tag.replace(/\//g, "")).length < 3
      ? false
      : req.body.tags
          .split(",")
          .map(tag => tag.toLowerCase().trim().replace(/\//g, ""))

  if (!tags) throw Error("TAGS_COUNT_NOT_REACHED")

  const idUser = req.user?.id
  const displayName = req.user?.displayName
  const link = `http${
    req.body.link.includes("https://") ? "s" : ""
  }://www.${req.body.link
    .replace("http://", "")
    .replace("https://", "")
    .replace("www.", "")}`

  const newPost = new Post({
    description: req.body.description,
    comments: 0,
    downs: 0,
    link,
    images: req.body.images,
    idUser,
    postedByName: displayName,
    ratio: getRating(0, 0),
    tags,
    title: req.body.title,
    ups: 0,
  })

  await newPost.save()

  const responseData: PostSubmitData = { id: newPost._id }
  setResponseData(res, responseData)
}

// Node.js implementation of Evan Miller's algorithm for ranking stuff based on upvotes:
// http://www.evanmiller.org/how-not-to-sort-by-average-rating.html
// https://medium.com/@gattermeier/calculating-better-rating-scores-for-things-voted-on-7fa3f632c79d
const getRating = (upvotes, n = 0, confidence = 0.95) => {
  if (n === 0) return 0

  const z = 1.96 // probit(1 - (1 - confidence) / 2)
  const phat = (1.0 * upvotes) / n

  return (
    (phat +
      (z * z) / (2 * n) -
      z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * n)) / n)) /
    (1 + (z * z) / n)
  )
}

// interface EResponse extends Response {
//   locals?: {
//     user: {
//       id: string
//     }
//   }
// }
// Pick<T, Diff<keyof T, keyof U>>
// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
// interface PostModel extends Omit<PostData, "id"> {
//   _id: string
// }

export { getPost, getPosts, getNotifications, getTags, postPost, postRating }
