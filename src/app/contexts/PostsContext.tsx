import React, { createContext, useContext, useState } from 'react';
import { Canceler } from 'axios';
import { ErrorContext } from './ErrorContext.jsx';
import { get } from './utils/api';

// TODO: add error type
interface PostDataInterface {
  data: {
    post: PostData
    errors?: {},
  },
  cancel: () => void
  hasFailed: boolean
}

interface PostsDataInterface {
  data: {
    ids: string[]
    posts: PostData[]
    errors?: {},
  },
  cancel: () => void
  hasFailed: boolean
}

interface PostData {
  id: string
  title: string
  description: string
  images: string[]
  comments: number
  downs: number
  link: string
  postedByName: string
  rated: -1 | 0 | 1
  ups: number
}

export interface Post extends PostData {
  col: number
  dismiss?: () => {}
  openPost?: () => {}
  row: number
  size: number
  type: string
}

interface PostContextInterface {
  focused: string
  ids: string[]
  getPost: (id: string) => Promise<Canceler>
  getPosts: (url: string, type: string) => Promise<Canceler>
  posts: {}
  previousUrl: string
  setFocused: (id: string) => void
  setIds: (ids: string[]) => void
  setPosts: (posts: Post[]) => void
  setPreviousUrl: (urL: string) => void
}

const initialState = {
  focused: '',
  ids: [],
  getPost: (id: string) => new Promise<Canceler>(message => {}),
  getPosts: (url: string, type: string) => new Promise<Canceler>(message => {}),
  posts: {},
  previousUrl: '',
  setFocused: (id: string) => {},
  setIds: (ids: string[]) => {},
  setPosts: (posts: Post[]) => {},
  setPreviousUrl: (urL: string) => {},
}

const PostsContext = createContext<PostContextInterface>(initialState)

const samplePost = {
  description: '',
  image: 'sample',
  rated: 0,
  title: 'Submit a post!'
};

const PostsProvider = ({ children }) => {
  const [focused, setFocused] = useState('');
  const [previousUrl, setPreviousUrl] = useState('')
  const [posts, setPosts] = useState({});
  const [ids, setIds] = useState<string[]>([]);
  const { setErrors } = useContext(ErrorContext);

  const getPosts: PostContextInterface["getPosts"] = async (url: string, type: string) => {
    const postsData: PostsDataInterface = await get(url, () =>
      setErrors(errors => [...errors, 'some error message here'])
    )
    const {
      data: { errors, ids, posts },
      cancel,
      hasFailed
    } = postsData

    if (errors) {
      setErrors(errors => [...errors, errors])
    } else if (!hasFailed) {
      const loaded: PostData | {} = {}

      ids.forEach(
        id =>
          (loaded[id] =
            id.length == 20
              ? { _id: id, postedByName: type, ...samplePost }
              : posts[id])
      )

      setPosts(() => {
        setIds(ids)
        return loaded
      })
    }

    return cancel
  }

  const getPost = async (id: string) => {
    const postData: PostDataInterface = await get(
      `/get/post/${id}`,
      () => setErrors(errors => [...errors, 'some error message here'])
    )

    const {
      data: { errors, post },
      cancel,
      hasFailed
    } = postData

    if (errors) {
      setErrors(errors => [...errors, errors])
    } else if (!hasFailed) {
      setPosts(posts => ({ ...posts, [id]: post }))
      setFocused(id)
    }
    
    return cancel
  }

  return (
    <PostsContext.Provider value={{
      focused,
      getPost,
      getPosts,
      ids,
      posts,
      previousUrl,
      setFocused,
      setIds,
      setPosts,
      setPreviousUrl
    }}>
      {children}
    </PostsContext.Provider>
  )
}

export { PostsProvider, PostsContext };
