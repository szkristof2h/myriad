import React, { createContext, useContext, useState } from "react"
import { Canceler } from "axios"
import { ErrorContext } from "./ErrorContext"
import { get, post, APIRequestInteface } from "../utils/api"

// TODO: add error type
export interface GetPostsInterface extends APIRequestInteface<GetPostsData> {}
export interface GetPostInterface extends APIRequestInteface<GetPostData> {}
interface UpdatePostInterface extends APIRequestInteface<UpdatePostData> {}

export interface GetPostsData {
  ids: string[]
  posts: PostData[]
  error?: {}
}

export interface GetPostData {
  post: PostData
  error?: {}
}

interface UpdatePostData extends GetPostData {}

export interface PostData {
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
  dismiss?: () => void
  openPost?: () => {}
  row: number
  size: number
  type: string
}

interface PostContextInterface {
  focused: string
  ids: string[]
  getPost: (
    id: string
  ) => { cancel: Canceler; setPostContext: () => Promise<void> }
  getPosts: (
    url: string,
    type?: string
  ) => { cancel: Canceler; setPostsContext: () => Promise<void> }
  posts: {}
  previousUrl: string
  setFocused: (id: string) => void
  setIds: (ids: string[]) => void
  setPosts: (posts: Post[]) => void
  setPreviousUrl: (urL: string) => void
  updatePost: (
    id: string,
    variables
  ) => { cancel: Canceler; setPostContext: () => Promise<void> }
}

// Should find a better & easier way to provide an initial state to react contexts
const initialState: PostContextInterface = {
  focused: "",
  ids: [],
  getPost: (id: string) => ({
    cancel: (message?: string) => {},
    setPostContext: () => new Promise(() => {}),
  }),
  getPosts: (url: string, type?: string) => ({
    cancel: (message?: string) => {},
    setPostsContext: () => new Promise(() => {}),
  }),
  posts: {},
  previousUrl: "",
  setFocused: (id: string) => {},
  setIds: (ids: string[]) => {},
  setPosts: (posts: Post[]) => {},
  setPreviousUrl: (urL: string) => {},
  updatePost: (id: string, variables) => ({
    cancel: (message?: string) => {},
    setPostContext: () => new Promise(() => {}),
  }),
}

const PostsContext = createContext<PostContextInterface>(initialState)

const samplePost = {
  description: "",
  image: "sample",
  rated: 0,
  title: "Submit a post!",
}

const PostsProvider = ({ children }) => {
  const [focused, setFocused] = useState("")
  const [previousUrl, setPreviousUrl] = useState("")
  const [posts, setPosts] = useState({})
  const [ids, setIds] = useState<string[]>([])
  const { addError } = useContext(ErrorContext)

  const getPosts: PostContextInterface["getPosts"] = (url, type) => {
    const { getData, cancel, getHasFailed }: GetPostsInterface = get<
      GetPostsData
    >(url, () => addError({ posts: ["some error message here"] }))

    const setPostsContext = async () => {
      const response = await getData()

      if (getHasFailed() || !response)
        return addError({ posts: [`get posts request failed`] })

      const {
        data: { error, ids, posts },
      } = response

      if (error) return addError(error)

      const loaded: PostData | {} = {}

      ids.forEach(
        id =>
          (loaded[id] =
            id.length === 20
              ? { _id: id, postedByName: type, ...samplePost }
              : posts[id])
      )

      setPosts(() => {
        setIds(ids)
        return loaded
      })
    }

    return { cancel, setPostsContext }
  }

  const getPost: PostContextInterface["getPost"] = (id: string) => {
    const { getData, cancel, getHasFailed }: GetPostInterface = get<
      GetPostData
    >(`post/${id}`, () => addError({ posts: ["some error message here"] }))

    const setPostContext = async () => {
      const response = await getData()

      if (getHasFailed() || !response)
        return addError({ posts: [`get post request failed`] })

      const {
        data: { error, post },
      } = response

      if (error) return addError(error)

      setPosts(posts => ({ ...posts, [id]: post }))
      setFocused(id)
    }

    return { cancel, setPostContext }
  }

  const updatePost: PostContextInterface["updatePost"] = (
    id: string,
    variables
  ) => {
    const { getData, cancel, getHasFailed }: UpdatePostInterface = post<
      UpdatePostData
    >(`post/${id}`, variables, () =>
      addError({ posts: ["some error message here"] })
    )

    const setPostContext = async () => {
      const response = await getData()

      if (getHasFailed() || !response)
        return addError({ posts: [`update post request failed`] })

      const {
        data: { error, post },
      } = response

      if (error) return addError(error)

      setPosts(posts => ({ ...posts, [id]: post }))
    }

    return { cancel, setPostContext }
  }

  return (
    <PostsContext.Provider
      value={{
        focused,
        getPost,
        getPosts,
        ids: ids,
        posts,
        previousUrl,
        setFocused,
        setIds: setIds,
        setPosts,
        setPreviousUrl,
        updatePost,
      }}
    >
      {children}
    </PostsContext.Provider>
  )
}

export { PostsProvider, PostsContext }
