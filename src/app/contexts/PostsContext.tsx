import React, { createContext, useEffect, useState } from "react"
import { PostType } from "src/server/db/models/Post"
import useGetData from "../hooks/useGetData"

export interface GetPostsData {
  posts: PostData[]
}

export interface GetPostData {
  post: PostData
}

export interface PostData extends PostType {
  id: string
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
  idPosts: string[]
  isLoadingPosts: boolean
  notifications: PostData[]
  posts: PostData[] | undefined
  previousUrl: string
  refetchPosts: () => void
  setFocused: (id: string) => void
  setNotifications: (posts: Post[]) => void
  setPreviousUrl: (urL: string) => void
}

// Should find a better & easier way to provide an initial state to react contexts
const initialState: PostContextInterface = {
  focused: "",
  getPosts: (url: string) => {},
  idPosts: [],
  isLoadingPosts: true,
  notifications: [],
  posts: [],
  previousUrl: "",
  refetchPosts: () => {},
  setFocused: (id: string) => {},
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
  ratio: 0,
  tags: [],
  title: "Submit a post!",
  ups: 0,
}

const PostsProvider = ({ children }) => {
  const [idPosts, setIdPosts] = useState<string[]>([])
  const [focused, setFocused] = useState("")
  const [previousUrl, setPreviousUrl] = useState("")
  const [url, setUrl] = useState("posts")
  const [notifications, setNotifications] = useState<PostData[]>([])
  const {
    data: postsData,
    isLoading: isLoadingPosts,
    refetch: refetchPosts,
  } = useGetData<GetPostsData>(url)

  const getPosts = (url: string) => {
    setUrl(url)
  }

  useEffect(() => {
    const ids = postsData?.posts?.map(post => post.id)

    if (ids && ids?.some(id => !idPosts.includes(id))) setIdPosts(ids)
  }, [postsData])

  return (
    <PostsContext.Provider
      value={{
        focused,
        getPosts,
        idPosts,
        isLoadingPosts,
        notifications,
        posts: postsData?.posts,
        previousUrl,
        refetchPosts,
        setFocused,
        setNotifications,
        setPreviousUrl,
      }}
    >
      {children}
    </PostsContext.Provider>
  )
}

export { PostsProvider, PostsContext }
