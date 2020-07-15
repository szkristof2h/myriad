import isURL from "validator/lib/isURL"
import { Request, Response, NextFunction } from "express"
import { sanitize, setErrorType, setResponseData } from "../../utils"
import {
  BLOCK_USER_ERROR,
  CHECK_DISPLAY_NAME_ERROR,
  FOLLOW_USER_ERROR,
  GET_USER_ERROR,
  INVALID_ID,
  SET_DISPLAY_NAME_ERROR,
  USER_NOT_FOUND,
  UPDATE_PROFILE_ERROR,
} from "../types"
import User, { UserModel } from "../models/User"
import BlockedList, { BlockedListModel } from "../models/BlockedList"
import FollowList, { FollowListModel } from "../models/FollowList"
import { GetUserData } from "../../../app/contexts/UserContext"
import {
  IsNameAvailableData,
  UpdateProfileData,
  UpdateProfileVariables,
} from "src/app/User/EditProfile"
import {
  PostFollowData,
  PostUnBlockData,
  PostUnFollowData,
  PostBlockData,
} from "src/app/User/Profile"

const block = async (req: Request, res: Response, next: NextFunction) => {
  setErrorType(res, "POST_Block_ERROR")
  const { idTarget } = req.body
  const idUser = req.user?.id

  const user: UserModel = await User.findById(idTarget).lean().exec()

  if (!user) throw Error("USER_NOT_FOUND")

  const block: BlockedListModel[] = await BlockedList.find({ idUser, idTarget })
    .lean()
    .exec()

  if (block.length !== 0) {
    setResponseData(res, {
      error: {
        shouldShow: false,
        type: "profile",
        message: "Already blocking user.",
      },
    })

    return next()
  }

  const newBlock = new BlockedList({ idUser, idTarget })

  newBlock.save()

  const responseData: PostBlockData = { status: "success" }

  setResponseData(res, responseData)
}

const checkDisplayName = async (req: Request, res: Response) => {
  setErrorType(res, "GET_CHECK_DISPLAYNAME")
  const { displayName } = req.params.displayName ? req.params : req.body
  const user = await User.findOne({
    displayName: displayName.toLowerCase(),
  })
    .lean()
    .exec()

  const responseData: IsNameAvailableData = { isNameAvailable: !user }

  setResponseData(res, responseData)
}
const follow = async (req: Request, res: Response, next: NextFunction) => {
  setErrorType(res, "POST_FOLLOW_ERROR")
  const { idTarget } = req.body
  const idUser = req.user?.id

  const user: UserModel = await User.findById(idTarget).lean().exec()

  if (!user) throw Error("USER_NOT_FOUND")

  const follow: FollowListModel[] = await FollowList.find({ idUser, idTarget })
    .lean()
    .exec()

  if (follow.length !== 0) {
    setResponseData(res, {
      error: {
        shouldShow: false,
        type: "profile",
        message: "Already following user.",
      },
    })

    return next()
  }

  const newFollow = new FollowList({ idUser, idTarget })

  newFollow.save()

  const responseData: PostFollowData = { status: "success" }

  setResponseData(res, responseData)
}

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const idUser = req.user?.id
  const isLoggedIn = !!idUser
  const profileName = req.params?.name
  const search = profileName
    ? { displayName: profileName }
    : idUser
    ? { _id: idUser }
    : null

  setErrorType(res, "GET_USER_ERROR")

  if (!search) {
    setResponseData(res, {
      error: {
        shouldShow: false,
        type: "profile",
        message: "You're not logged in",
      },
    })

    return next()
  }

  const userFromDB: UserModel[] = await User.find(search)
    .select("-idGoogle -social")
    .lean()
    .exec()

  if (userFromDB.length === 0) throw Error("INVALID_ID")

  const { _id, _v, ...user } = userFromDB[0]
  const isFollowed = idUser
    ? await FollowList.find({
        idUser,
        idTarget: _id,
      })
        .lean()
        .exec()
    : []
  const isBlocked = idUser
    ? await BlockedList.find({
        idUser,
        idTarget: _id,
      })
        .lean()
        .exec()
    : []
  const responseData: GetUserData = {
    user: {
      id: _id,
      isFollowed: !!isFollowed.length,
      isBlocked: !!isBlocked.length,
      ...user,
      ...(idUser ? { isLoggedIn } : {}),
    },
  }

  setResponseData(res, responseData)
}

export function setDisplayName(req, res) {
  // const { displayName } = req.body
  // const userId = res.locals.user.id
  // if (
  //   !displayName ||
  //   typeof displayName !== "string" ||
  //   displayName.length < 3 ||
  //   displayName.length > 20
  // )
  //   // return res.json(
  //   //   handleErrors(SET_DISPLAY_NAME_ERROR, {
  //   //     errors: { displayName: { message: "Invalid display name!" } },
  //   //   })
  //   // )
  //   checkDisplayName(req, null).then(r =>
  //     r
  //       ? User.findById(userId)
  //           .exec()
  //           .then(user => {
  //             if (user.displayName)
  //               return Promise.reject({
  //                 errors: {
  //                   profile: {
  //                     message: "You've already set your display name!",
  //                   },
  //                 },
  //               })
  //             user.displayName = displayName.toLowerCase()
  //             return user.save()
  //           })
  //           .then(() => res.json({ status: "Successfully set display name!" }))
  //       : Promise.reject({
  //           errors: {
  //             displayName: { message: "That display name is already in use!" },
  //           },
  //         })
  //   )
  // .catch(e => res.json(handleErrors(SET_DISPLAY_NAME_ERROR, e)))
}

const unblock = async (req: Request, res: Response) => {
  setErrorType(res, "POST_UNBLOCK_ERROR")
  const { idTarget } = req.body
  const idUser = req.user?.id

  await BlockedList.findOneAndDelete({ idUser, idTarget })

  const responseData: PostUnBlockData = { status: "success" }

  setResponseData(res, responseData)
}

const unfollow = async (req: Request, res: Response) => {
  setErrorType(res, "POST_UNFOLLOW_ERROR")
  const { idTarget } = req.body
  const idUser = req.user?.id

  await FollowList.findOneAndDelete({ idUser, idTarget })

  const responseData: PostUnFollowData = { status: "success" }

  setResponseData(res, responseData)
}

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  setErrorType(res, "UPDATE_PROFILE")

  if (!req.session) throw Error("Please login...") // TODO: ???

  const { avatar, bio, displayName }: UpdateProfileVariables = req.body
  const idUser = req.user?.id
  const hasDisplayName = !!req.user?.displayName

  const user = await User.findById(idUser).exec()

  if (!hasDisplayName && !displayName) {
    setResponseData(res, {
      error: {
        type: "profile",
        message:
          "You cannot update your profile without setting a displayname!",
      },
    })

    return next()
  }

  if (hasDisplayName && displayName) {
    setResponseData(res, {
      error: {
        type: "profile",
        message: "Once set, you cannot change your displayname!",
      },
    })

    return next()
  }

  if (!hasDisplayName && displayName) {
    const sanitizedDisplayName = sanitize(displayName)

    if (sanitizedDisplayName.length < 3) {
      setResponseData(res, {
        error: {
          type: "profile",
          message: "Your displayname shouldn't be less than 3 characters long!",
        },
      })

      return next()
    } else if (sanitizedDisplayName.length > 50) {
      setResponseData(res, {
        error: {
          type: "profile",
          message:
            "Your displayname should not be more than 50 characters long!",
        },
      })

      return next()
    }

    const isDisplayNameUnique = await User.find({ displayName }).lean().exec()

    if (isDisplayNameUnique.length > 0) {
      setResponseData(res, {
        error: {
          type: "profile",
          message: "That displayname is not available!",
        },
      })

      return next()
    }

    user.displayName = sanitizedDisplayName
  }

  if (!avatar && !bio && hasDisplayName) {
    setResponseData(res, {
      error: {
        type: "profile",
        message: "You cannot update your profile without changing anything!",
      },
    })

    return next()
  }

  if (avatar) {
    if (!isURL(avatar)) {
      // TODO: should check if can load image
      setResponseData(res, {
        error: {
          type: "profile",
          message: "Invalid url for avatar!",
        },
      })

      return next()
    }

    user.avatar = avatar
  }

  if (bio) {
    const sanitzedBio = sanitize(bio)

    if (sanitzedBio.length < 3) {
      setResponseData(res, {
        error: {
          type: "profile",
          message: "Your profile bio should be > 3 characters long!",
        },
      })

      return next()
    } else if (sanitzedBio.length > 200) {
      setResponseData(res, {
        error: {
          type: "profile",
          message: "Your profile bio should be < 200 characters long!",
        },
      })

      return next()
    }

    user.bio = sanitzedBio
  }

  await user.save()

  if (displayName)
    req.session.user = {
      id: idUser,
      displayName,
    }

  const responseData: UpdateProfileData = {
    isUpdateSuccessful: true,
  }

  setResponseData(res, responseData)
}

export {
  block,
  checkDisplayName,
  follow,
  getUser,
  unblock,
  unfollow,
  updateProfile,
}
