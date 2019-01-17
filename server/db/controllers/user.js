import isURL from 'validator/lib/isURL';
import { handleErrors, sanitize } from '../../util/misc';
import {
  BLOCK_USER_ERROR,
  CHECK_DISPLAY_NAME_ERROR,
  FOLLOW_USER_ERROR,
  GET_USER_ERROR,
  INVALID_ID,
  SET_DISPLAY_NAME_ERROR,
  USER_NOT_FOUND,
  UPDATE_PROFILE_ERROR
} from '../types';
import User from '../models/User';
import BlockedList from '../models/BlockedList';
import FollowedList from '../models/FollowedList';


export function block(req, res) {
  const { targetUser } = req.body;
  const userId = res.locals.user.id;
  
  User
    .findById(targetUser)
    .exec()
    .then(user => user ? '' : Promise.reject({ errors: { id: { message: USER_NOT_FOUND } } }))
    .then(() => BlockedList.findOne({ by: userId, user: targetUser }).exec())
    .then(b => b ? Promise.reject({ errors: { blocked: { message: 'User already blocked!' } } }) : '')
    .then(() => {
      const newBlock = new BlockedList({ by: userId, user: targetUser });
      return newBlock.save();
    })
    .then(() => res.json({ status: 'User successfully blocked!', type: 'blocked' }))
    .catch(e => res.json(handleErrors(BLOCK_USER_ERROR, e)))
}

export function checkDisplayName(req, res) {
  const { displayName } = req.params.displayName ? req.params : req.body;

  return User
    .findOne({ displayName: displayName.toLowerCase() })
    .exec()
    .then(u => !u ? res ? res.json({ status: 'Name is available!' }) : true :
      Promise.reject({
        errors: { displayName: { message: 'That display name is already in use!' } }
      })
    )
    .catch(e => res ? res.json(handleErrors(CHECK_DISPLAY_NAME_ERROR, e)) : false);
}

export function follow(req, res) {
  const { targetUser } = req.body;
  const userId = res.locals && res.locals.user ? res.locals.user.id : null;

  User
    .findById(targetUser)
    .exec()
    .then(user => user ? '' : Promise.reject({ errors: { id: { message: USER_NOT_FOUND } } }))
    .then(() => FollowedList.findOne({ from: userId, to: targetUser }).exec())
    .then(b => b ? Promise.reject({ errors: { message: { followed: 'User already followed!' } } }) : '')
    .then(() => {
      const newFollow = new FollowedList({ from: userId, to: targetUser });
      return newFollow.save();
    })
    .then(() => res.json({ status: 'User successfully followed!', type: 'followed' }))
    .catch(e => res.json(handleErrors(FOLLOW_USER_ERROR, e)))
}

export function getUser(req, res) {
  const userId = res.locals && res.locals.user ? res.locals.user.id : null;
  const profileName = req.params && req.params.name ? req.params.name : res.locals && res.locals.user ?
    res.locals.user.displayName : null;
  let user = {};
  let search = profileName ? { displayName: profileName } : res.locals && res.locals.user && res.locals.user.id ?
    { _id: res.locals.user.id } : null;
  
  if (!search) return res.json(handleErrors(GET_USER_ERROR, { errors: { id: { message: INVALID_ID } } }));

  User
    .findOne(search)
    .select('-googleId -social')
    .exec()
    .then(u => {
      user = u._doc;
      return !userId ? false : FollowedList.findOne({ from: userId, to: user._id }).exec();
    })
    .then(r => {
      if (r) user.followed = true;
      else user.followed = false;
      return !userId ? false : BlockedList.findOne({ by: userId, user: user._id }).exec();
    })
    .then(r => {
      if (r) user.blocked = true;
      else user.blocked = false;
      return res.json(user);
    })
    .catch(e => res.json(handleErrors(GET_USER_ERROR, e)));
}

export function setDisplayName(req, res) {
  const { displayName } = req.body;
  const userId = res.locals.user.id;

  if (!displayName || typeof displayName !== 'string' || displayName.length < 3 || displayName.length > 20)
    return res.json(handleErrors(SET_DISPLAY_NAME_ERROR, { errors: { displayName: { message: 'Invalid display name!' } } }))

  checkDisplayName(req, null)
    .then(r => 
      r ? User
        .findById(userId)
        .exec()
        .then(user => {
          if (user.displayName) return Promise.reject(
            { errors: { profile: { message: 'You\'ve already set your display name!' } } }
          )

          user.displayName = displayName.toLowerCase();
          return user.save();
        })
        .then(() => res.json({ status: 'Successfully set display name!' }))
        : Promise.reject({ errors: { displayName: { message: 'That display name is already in use!' } } })
    )
    .catch(e => res.json(handleErrors(SET_DISPLAY_NAME_ERROR, e)));
}

export function unblock(req, res) {
  const userId = res.locals.user.id;
  const { targetUser } = req.body;

  BlockedList
    .findOneAndDelete({ by: userId, user: targetUser })
    .exec()
    .then(block => block ? res.json({ status: 'User successfully unblocked!', type: 'blocked' }) :
      Promise.reject({ errors: { block: { message: 'You can\'t unblock someone if they aren\'t blocked!' } } }))
    .catch(e => res.json(handleErrors(BLOCK_USER_ERROR, e)))
}

export function unfollow(req, res) {
  const userId = res.locals && res.locals.user ? res.locals.user.id : null;
  const { targetUser } = req.body;

  FollowedList
    .findOneAndDelete({ from: userId, to: targetUser })
    .exec()
    .then(follow => follow ? res.json({ status: 'User successfully unfollowed!', type: 'followed' }) :
      Promise.reject({ errors: { block: { message: 'You can\'t unfollowed someone if you don\'t follow them!' } } }))
    .catch(e => res.json(handleErrors(FOLLOW_USER_ERROR, e)))
}

export function updateProfile(req, res) {
  let { avatar, bio } = req.body;
  const userId = res.locals.user.id;
  const newProfile = {};
  bio = sanitize(bio);

  if (!avatar && !bio) return res.json(handleErrors(UPDATE_PROFILE_ERROR,
    { errors: { profile: { message: 'You cannot update your profile without changing anything!' } } }
  ))

  if (avatar)
    if (!isURL(avatar)) return res.json(handleErrors(UPDATE_PROFILE_ERROR, 
      { errors: { avatar: { message: 'Invalid url for avatar!' } } }));
    else newProfile.avatar = avatar;

  if (bio)
    if (bio.length < 3) return res.json(handleErrors(UPDATE_PROFILE_ERROR,
      { errors: { bio: { message: 'Your profile bio should be > 3 characters long!' } } }
    ))
    else if (bio.length > 200) return res.json(handleErrors(UPDATE_PROFILE_ERROR,
      { errors: { bio: { message: 'Your profile bio should be < 200 characters long!' } } }
    ))
    else newProfile.bio = bio;

  User
    .findByIdAndUpdate(userId, newProfile)
    .exec()
    .then(() => res.json({ status: 'Successfully updated profile' }))
    .catch(e => res ? res.json(handleErrors(UPDATE_PROFILE_ERROR, e)) : false);
}
