import React, { createContext, useContext, useState } from "react"
import { Canceler } from "axios"
import { ErrorContext } from "./ErrorContext"
import { get, post, APIRequestInteface } from "../requests/api"
import { PostType } from "src/server/db/models/Post"

// TODO: add error type
export interface GetPostsInterface extends APIRequestInteface<GetPostsData> {}
export interface GetPostInterface extends APIRequestInteface<GetPostData> {}
interface UpdatePostInterface extends APIRequestInteface<UpdatePostData> {}

export interface GetPostsData {
  posts: PostData[]
}

export interface GetPostData {
  post: PostData
}

interface UpdatePostData extends GetPostData {}

export interface PostData extends PostType {
  id: string
  rating: number
}

export interface Post extends PostData {
  col?: number
  dismiss?: () => void
  openPost?: () => void
  row?: number
  size?: number
  type?: string
}

interface PostContextInterface {
  focused: string
  getPost: (
    id: string
  ) => { cancel: Canceler; setPostContext: () => Promise<void> }
  getPosts: (
    url: string,
    type?: string
  ) => { cancel: Canceler; setPostsContext: () => Promise<void> }
  notifications: PostData[]
  posts: PostData[]
  previousUrl: string
  setFocused: (id: string) => void
  setPosts: (posts: Post[]) => void
  setNotifications: (posts: Post[]) => void
  setPreviousUrl: (urL: string) => void
  updatePost: (
    id: string,
    variables
  ) => { cancel: Canceler; setPostContext: () => Promise<void> }
}

const makeId = () => {
  var text = ""
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (var i = 0; i < 20; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

// Should find a better & easier way to provide an initial state to react contexts
const initialState: PostContextInterface = {
  focused: "",
  getPost: (id: string) => ({
    cancel: (message?: string) => {},
    setPostContext: () => new Promise(() => {}),
  }),
  getPosts: (url: string, type?: string) => ({
    cancel: (message?: string) => {},
    setPostsContext: () => new Promise(() => {}),
  }),
  notifications: [],
  posts: [],
  previousUrl: "",
  setFocused: (id: string) => {},
  setPosts: (posts: Post[]) => {},
  setNotifications: (posts: Post[]) => {},
  setPreviousUrl: (urL: string) => {},
  updatePost: (id: string, variables) => ({
    cancel: (message?: string) => {},
    setPostContext: () => new Promise(() => {}),
  }),
}

const PostsContext = createContext<PostContextInterface>(initialState)

const samplePost = {
  description: "",
  comments: 0,
  date: new Date(),
  downs: 0,
  idUser: "",
  images: ["sample"],
  link: "",
  postedById: "",
  rating: 0,
  ratio: 0,
  tags: [],
  title: "Submit a post!",
  ups: 0,
}

const PostsProvider = ({ children }) => {
  const [focused, setFocused] = useState("")
  const [previousUrl, setPreviousUrl] = useState("")
  const [posts, setPosts] = useState<PostData[]>([])
  const [notifications, setNotifications] = useState<PostData[]>([])
  const { addError } = useContext(ErrorContext)
  const limits = [1, 16, 28] // use some kind of constant for this... env?

  const getPosts: PostContextInterface["getPosts"] = (url, type = "") => {
    const { getData, cancel, getHasFailed }: GetPostsInterface = get<
      GetPostsData
    >(url, () => addError({ posts: ["some error message here"] }))

    const setPostsContext = async () => {
      const response = await getData()

      if (getHasFailed() || !response)
        return addError({ posts: [`get posts request failed`] })

      const {
        data: { error, posts: newPosts },
      } = response

      if (error) return addError(error.message, error.type)

      const missingPosts = limits.reduce((a, v) => a + v) - newPosts.length
      const fillerPosts: PostData[] = new Array(missingPosts)
        .fill("")
        .map(_ => ({ id: makeId(), postedByName: type, ...samplePost }))

      if (url.split("/")[0] === "notifications")
        setNotifications([...new Set([...notifications, ...newPosts])])
      else setPosts([...newPosts, ...fillerPosts])
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
        data: { error, post: postData },
      } = response

      if (error) return addError(error.message, error.type)

      setPosts(
        posts.find(post => post.id === postData.id)
          ? posts.map(post => (post.id === postData.id ? postData : post))
          : [...posts, postData]
      )
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

      if (error) return addError(error.message, error.type)

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
        notifications,
        posts,
        previousUrl,
        setFocused,
        setNotifications,
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
