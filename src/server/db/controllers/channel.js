import Post from "../models/Post";
// import { handleErrors, toObject } from "../../util/misc";
// import {
//   GET_POST_ERROR
// } from "../types";
// import Subscription from "../models/Subscription";
import Channel from "../models/Channel";

const createChannels = async () => {
  const postsTag = await Post.find().select("tags").lean().exec();
  const tagsArray = [];

  postsTag.forEach(post => {
    tagsArray.push(...post.tags);
  });

  const tags = [...new Set(tagsArray)];

  const getRandom = () => tags[Math.floor(Math.random() * tags.length)];

  const asd = Promise.all(new Array(10).fill("").map(_ => {
    const channelTags = new Array(Math.floor(Math.random() * 5) + 5)
      .fill("")
      .map(_ => getRandom());

    const channel = new Channel({
      description: "this is a channel",
      tags: channelTags,
      title: channelTags[0],
      posts: 0
    });

    channel.save();
  }));

  try {
    await asd;
  } catch (e) {
    console.log(e);
  }
};

const getPosts = async () =>
  Post.find()
    .sort("-createdAt")
    .limit(10)
    .exec();

const getBestChannelForTags = tags =>
  Channel.aggregate([
    { $match: { Keys: { $in: tags } } },
    {
      $project: {
        ID: 1,
        tags: 1,
        order: {
          $size: {
            $setIntersection: [tags, "$tags"]
          }
        }
      }
    },
    { $sort: { order: -1 } }
  ]).exec();


const getChannelsForPosts = async (channels, tryCount) => {
  const posts = await getPosts();
  const promiseForEachPosts = posts.map(post => getBestChannelForTags(post.tags));
  const newChannels = await Promise.all(promiseForEachPosts);
  const allChannels = [...channels, ...newChannels];

  if (allChannels.length > 5 || tryCount === 9) return allChannels;

  return getChannelsForPosts(allChannels, tryCount + 1);
};

const getChannels = async (req, res) => {
  const channels = await getChannelsForPosts([], 0);

  return res.json(channels);
};

export { createChannels, getChannels };
