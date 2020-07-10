import React, { createContext, useContext, useState } from "react"
import { ErrorContext } from "./ErrorContext"
import { APIRequestInteface } from "../requests/api"
import { PostType } from "src/server/db/models/Post"
import useGetData from "../hooks/useGetData"

export interface GetPostsInterface extends APIRequestInteface<GetPostsData> {}
export interface GetPostInterface extends APIRequestInteface<GetPostData> {}

export interface GetPostsData {
  posts: PostData[]
}

export interface GetPostData {
  post: PostData
}

export interface PostData extends PostType {
  id: string
  rating: number
}

export interface Post extends PostData {
  col?: number
  dismiss?: () => void
  isLoading?: boolean
  openPost?: () => void
  row?: number
  size?: number
  type?: string
}

interface PostContextInterface {
  focused: string
  getPosts: (url: string) => void
  isLoadingPosts: boolean
  notifications: PostData[]
  posts: PostData[] | undefined
  previousUrl: string
  refetchPosts: () => void
  setFocused: (id: string) => void
  setPosts: (posts: Post[]) => void
  setNotifications: (posts: Post[]) => void
  setPreviousUrl: (urL: string) => void
}

// Should find a better & easier way to provide an initial state to react contexts
const initialState: PostContextInterface = {
  focused: "",
  getPosts: (url: string) => {},
  isLoadingPosts: true,
  notifications: [],
  posts: [],
  previousUrl: "",
  refetchPosts: () => {},
  setFocused: (id: string) => {},
  setPosts: (posts: Post[]) => {},
  setNotifications: (posts: Post[]) => {},
  setPreviousUrl: (urL: string) => {},
}

const PostsContext = createContext<PostContextInterface>(initialState)

export const samplePost: PostData = {
  description: "",
  comments: 0,
  createdAt: new Date(),
  downs: 0,
  id: "",
  idUser: "",
  images: ["sample"],
  link: "",
  postedByName: "",
  rating: 0,
  ratio: 0,
  tags: [],
  title: "Submit a post!",
  ups: 0,
}

const PostsProvider = ({ children }) => {
  const [focused, setFocused] = useState("")
  const [previousUrl, setPreviousUrl] = useState("")
  const [url, setUrl] = useState("posts")
  const [posts, setPosts] = useState<PostData[]>([])
  const [notifications, setNotifications] = useState<PostData[]>([])
  const { addError } = useContext(ErrorContext)
  const {
    data: postsData,
    isLoading: isLoadingPosts,
    refetch: refetchPosts,
  } = useGetData<GetPostsData>(url)

  const getPosts = (url: string) => {
    setUrl(url)
  }

  return (
    <PostsContext.Provider
      value={{
        focused,
        getPosts,
        isLoadingPosts,
        notifications,
        posts: postsData?.posts,
        previousUrl,
        refetchPosts,
        setFocused,
        setNotifications,
        setPosts,
        setPreviousUrl,
      }}
    >
      {children}
    </PostsContext.Provider>
  )
}

export { PostsProvider, PostsContext }
