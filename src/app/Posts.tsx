import React, {
  FC,
  lazy,
  useContext,
  useEffect,
  useState,
  Suspense,
} from "react"
import { Route, RouteComponentProps } from "react-router-dom"
import { PostsContext, PostData, samplePost } from "./contexts/PostsContext"
import { UserContext } from "./contexts/UserContext"
import useWindowSize from "./hooks/useWindowSize"
import StyledPosts from "./Posts.style"
import Tags from "./Tags"
import GridPost from "./Post/GridPost"
import Loader from "./Loader"
import { makeId } from "./utils"

const Post = lazy(() =>
  import(
    "./Post/Post" /* webpackPreload: true */ /* webpackChunkName: "Post" */
  )
)

// TODO: move to utils
const setPos = (): [number[][], number] => {
  const ratio = [18, 6, 5]
  let positions = [[0, 0, ratio[0]]]
  let offset = 0

  const surround = (ratios: number[], index: number, a = 1) => {
    const currentRatio = ratios[1]
    const parentRatio = ratios[0]
    const length = Math.floor((parentRatio * a) / currentRatio) + 2

    for (let i = 0; i < length; i++) {
      positions = [
        ...positions,
        [(i - 1) * currentRatio - offset, -currentRatio - offset, currentRatio],
      ]
      positions = [
        ...positions,
        [
          (i - 1) * currentRatio - offset,
          (length - 2) * currentRatio - offset,
          currentRatio,
        ],
      ]
      if (i != 0 && i != length - 1)
        positions = [
          ...positions,
          [
            -currentRatio - offset,
            (i - 1) * currentRatio - offset,
            currentRatio,
          ],
        ]
      if (i != 0 && i != length - 1)
        positions = [
          ...positions,
          [
            (length - 2) * currentRatio - offset,
            (i - 1) * currentRatio - offset,
            currentRatio,
          ],
        ]
    }

    index++
    const newOffset = offset + currentRatio
    if (ratios.length !== index - 2) offset = newOffset
    ratios.length === index - 2
      ? true
      : surround(ratios.slice(1), index, length)
  }

  surround(ratio, 0)

  return [positions, offset]
}

interface Props extends RouteComponentProps {
  fullUrl: string
  tag: string
  url: string
  userName: string
}

const Posts: FC<Props> = ({ fullUrl, history, tag, userName }) => {
  const limits = [1, 16, 28] // use some kind of constant for this... env?
  const { currentUser } = useContext(UserContext)
  const { getPosts, isLoadingPosts, posts, setFocused } = useContext(
    PostsContext
  )
  const [positions, offset] = setPos()
  const [previousUrl, setPreviousUrl] = useState("")
  const { width, height } = useWindowSize()
  const missingPosts = limits.reduce((a, v) => a + v) - (posts?.length ?? 0)
  const postsFilledToLimit: PostData[] = [
    ...(isLoadingPosts ? [] : posts),
    ...new Array(missingPosts).fill({}).map(_ => ({
      ...samplePost,
      id: makeId(),
      postedByName: "",
    })),
  ]

  const openPost = (id: string) => {
    setFocused(id)
    history.push(
      id.length != 20
        ? `/post/${id}`
        : currentUser?.id
        ? currentUser?.displayName
          ? "/add"
          : "/profile"
        : "/login"
    )
  }
  const closePost = () => {
    setFocused("")
    history.push(previousUrl ? previousUrl : "/")
  }

  useEffect(() => {
    const type =
      fullUrl.split("/")[1] === "post"
        ? "post"
        : tag
        ? tag
        : userName
        ? userName
        : "posts"

    if (type !== "post" || !previousUrl) {
      getPosts(
        `posts${userName ? "/user" : ""}${
          tag ? "/" + tag.trim() : userName ? "/" + userName : ""
        }`
      )

      // TODO: instead of setting prevUrl to home it should set it according to the post's tags to make it more relevant
      setPreviousUrl(type === "post" ? "/" : fullUrl)
    }
  }, [fullUrl])

  return (
    <>
      <StyledPosts width={width} height={height}>
        {postsFilledToLimit.map((post, i) => {
          const { id, downs, images, postedByName, title, ups } = post

          return (
            positions?.[i] && (
              <GridPost
                key={post.id}
                col={positions[i][0] + 1 + offset}
                downs={downs}
                id={id}
                images={images}
                isLoading={isLoadingPosts}
                openPost={() => {
                  openPost(post.id)
                }}
                postedByName={postedByName}
                row={positions[i][1] + 1 + offset}
                size={positions[i][2]}
                title={title}
                ups={ups}
              />
            )
          )
        })}
      </StyledPosts>
      <Suspense fallback={<Loader />}>
        <Route
          exact
          path="/post/:idPost"
          render={({ match }) => {
            const idPost = match.params.idPost
            return <Post dismiss={closePost} id={idPost} />
          }}
        />
      </Suspense>
      <Tags />
    </>
  )
}

export default Posts
