import isURL from "validator/lib/isURL"
import { Request, Response, NextFunction } from "express"
import {
  handleErrors,
  sanitize,
  setErrorType,
  setResponseData,
} from "../../utils"
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
import BlockedList from "../models/BlockedList"
import FollowList from "../models/FollowList"
import { UserData, GetUserData } from "../../../app/contexts/UserContext"
import {
  IsNameAvailableData,
  UpdateProfileData,
  UpdateProfileVariables,
} from "src/app/User/EditProfile"

export function block(req, res) {
  const { targetUser } = req.body
  const userId = res.locals.user.id

  User.findById(targetUser)
    .exec()
    .then(user =>
      user
        ? ""
        : Promise.reject({ errors: { id: { message: USER_NOT_FOUND } } })
    )
    .then(() => BlockedList.findOne({ by: userId, user: targetUser }).exec())
    .then(b =>
      b
        ? Promise.reject({
            errors: { blocked: { message: "User already blocked!" } },
          })
        : ""
    )
    .then(() => {
      const newBlock = new BlockedList({ by: userId, user: targetUser })
      return newBlock.save()
    })
    .then(() =>
      res.json({ status: "User successfully blocked!", type: "blocked" })
    )
  // .catch(e => res.json(handleErrors(BLOCK_USER_ERROR, e)))
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

export function follow(req, res) {
  const { targetUser } = req.body
  const userId = res.locals && res.locals.user ? res.locals.user.id : null

  User.findById(targetUser)
    .exec()
    .then(user =>
      user
        ? ""
        : Promise.reject({ errors: { id: { message: USER_NOT_FOUND } } })
    )
    .then(() => FollowList.findOne({ from: userId, to: targetUser }).exec())
    .then(b =>
      b
        ? Promise.reject({
            errors: { message: { followed: "User already followed!" } },
          })
        : ""
    )
    .then(() => {
      const newFollow = new FollowList({ from: userId, to: targetUser })
      return newFollow.save()
    })
    .then(() =>
      res.json({ status: "User successfully followed!", type: "followed" })
    )
  // .catch(e => res.json(handleErrors(FOLLOW_USER_ERROR, e)))
}

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const idUser = req.user?.id
  const isLoggedIn = !!idUser
  const profileName = req.params?.name ? res.locals.user?.displayName : null
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

  const userFromDB: UserModel = await User.findOne(search)
    .select("-idGoogle -social")
    .lean()
    .exec()

  if (!userFromDB) throw Error("INVALID_ID")

  const { _id, _v, ...user } = userFromDB
  const isFollowed = idUser
    ? !!FollowList.findOne({
        from: idUser,
        to: _id,
      })
        .lean()
        .exec()
    : false
  const isBlocked = idUser
    ? !!BlockedList.findOne({
        by: idUser,
        user: _id,
      })
        .lean()
        .exec()
    : false

  const responseData: GetUserData = {
    user: {
      id: _id,
      isFollowed,
      isBlocked,
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

export function unblock(req, res) {
  const userId = res.locals.user.id
  const { targetUser } = req.body

  BlockedList.findOneAndDelete({ by: userId, user: targetUser })
    .exec()
    .then(block =>
      block
        ? res.json({ status: "User successfully unblocked!", type: "blocked" })
        : Promise.reject({
            errors: {
              block: {
                message: "You can't unblock someone if they aren't blocked!",
              },
            },
          })
    )
  // .catch(e => res.json(handleErrors(BLOCK_USER_ERROR, e)))
}

export function unfollow(req, res) {
  const userId = res.locals && res.locals.user ? res.locals.user.id : null
  const { targetUser } = req.body

  FollowList.findOneAndDelete({ from: userId, to: targetUser })
    .exec()
    .then(follow =>
      follow
        ? res.json({
            status: "User successfully unfollowed!",
            type: "followed",
          })
        : Promise.reject({
            errors: {
              block: {
                message:
                  "You can't unfollowed someone if you don't follow them!",
              },
            },
          })
    )
  // .catch(e => res.json(handleErrors(FOLLOW_USER_ERROR, e)))
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
      res.json(
        setResponseData(res, {
          error: {
            type: "profile",
            message:
              "Your displayname shouldn't be less than 3 characters long!",
          },
        })
      )

      return next()
    } else if (sanitizedDisplayName.length > 50) {
      res.json(
        setResponseData(res, {
          error: {
            type: "profile",
            message:
              "Your displayname should not be more than 50 characters long!",
          },
        })
      )

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
      res.json(
        setResponseData(res, {
          error: {
            type: "profile",
            message: "Your profile bio should be > 3 characters long!",
          },
        })
      )

      return next()
    } else if (sanitzedBio.length > 200) {
      res.json(
        setResponseData(res, {
          error: {
            type: "profile",
            message: "Your profile bio should be < 200 characters long!",
          },
        })
      )

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

export { checkDisplayName, getUser, updateProfile }
