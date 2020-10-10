import { Request, Response, NextFunction } from "express"
import Post, { PostModel } from "../models/Post"
import { setErrorType, setResponseData } from "../../utils"
import {
  GET_POST_ERROR,
  POST_NOT_FOUND,
  INVALID_RATING,
  POST_POST_ERROR,
  GET_POSTS_ERROR,
  GET_TAGS_ERROR,
  GET_NOTIFICATIONS_ERROR,
} from "../types"
import { Rating, RatingType, RatingModel } from "../models/Rating"
import FollowList, { FollowListModel } from "../models/FollowList"
import { GetPostsData, GetPostData } from "src/app/contexts/PostsContext"
import { GetRatingData, PostRatingData } from "src/app/contexts/RatingsContext"
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
          $in: Array.isArray(tags) ? tags : [tags],
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

  const responseData: GetPostsData = {
    posts: posts.map(post => {
      const { _id, _v, ...postWithout_id } = post

      return { ...postWithout_id, id: _id }
    }),
  }

  setResponseData(res, responseData)
}

const getRating = async (req: Request, res: Response) => {
  setErrorType(res, "GET_RATING")

  const { idPost } = req.params
  const idUser = req.user?.id

  const userRating: RatingModel | undefined = await Rating.findOne({
    idPost,
    idUser,
  })
    .lean()
    .exec()

  const postRatings:
    | Pick<PostModel, "downs" | "ups">
    | undefined = await Post.findById(idPost).select("downs ups").lean().exec()

  if (!postRatings) throw Error("POST_NOT_FOUND")

  const responseData: GetRatingData = {
    rating: {
      downs: postRatings.downs,
      idPost,
      ups: postRatings.ups,
      value: userRating?.value,
    },
  }

  setResponseData(res, responseData)
}

const addRating = async (req: Request, res: Response) => {
  setErrorType(res, "ADD_RATING")

  const { idPost, value } = req.body
  const idUser = req.user?.id

  if (![-1, 1].includes(value)) throw Error("INVALID_RATING")

  const post: PostModel | undefined = await Post.findById(idPost).exec()

  if (!post) throw Error("POST_NOT_FOUND")

  const rating: RatingModel | undefined = await Rating.findOne({
    idPost,
    idUser,
  })
    .select("value")
    .exec()

  if (rating) {
    post[rating.value > 0 ? "ups" : "downs"]--

    if (rating.value === value) Rating.deleteOne({ _id: rating._id }).exec()
    else if (rating.value !== value) {
      post[value < 0 ? "downs" : "ups"]++
      rating.value = value

      await rating.save()
    }
  } else {
    const newRating = new Rating({ idPost, idUser, value })

    await newRating.save()
    post[value < 0 ? "downs" : "ups"]++
  }

  await post.save()

  const newRating: RatingModel | undefined = await Rating.findOne({
    idPost,
    idUser,
  })
    .select("value")
    .lean()
    .exec()

  const responseData: PostRatingData = {
    rating: {
      downs: post.downs,
      idPost,
      ups: post.ups,
      value: newRating?.value ?? 0,
    },
  }
  setResponseData(res, responseData)
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
  const tags: string | undefined =
    req.body.tags?.split(",").filter((tag: string) => tag.replace(/\//g, ""))
      .length < 3
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
    tags,
    title: req.body.title,
    ups: 0,
  })

  await newPost.save()

  const responseData: PostSubmitData = { id: newPost._id }
  setResponseData(res, responseData)
}

export {
  getPost,
  getPosts,
  getNotifications,
  getRating,
  getTags,
  postPost,
  addRating,
}
