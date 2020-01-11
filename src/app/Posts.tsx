import React, {
  FC,
  lazy,
  Suspense,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Route, History } from 'react-router-dom'
import { NavigationContext } from './contexts/NavigationContext.jsx'
import { PostsContext } from './contexts/PostsContext'
import { UserContext } from './contexts/UserContext.jsx'
import useWindowSize from './hooks/useWindowSize'
import Loader from './Loader'
import StyledPosts from './Posts.style'
import Tags from './Tags.jsx'
import './posts.css'

const Post = lazy(() => import('./Post/Post' /* webpackChunkName: "Post" */))

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

interface Props {
  history: History
  fullUrl: string
  tag: string
  url: string
  userName: string
}

const Posts: FC<Props> = ({ fullUrl, history, tag, url, userName }) => {
  const [mounted, setMounted] = useState(true)
  const [offset, setOffset] = useState(0)
  const { refresh, setRefresh } = useContext(NavigationContext)
  const {
    focused,
    getPosts,
    ids,
    posts,
    previousUrl,
    setFocused,
    setPreviousUrl,
  } = useContext(PostsContext)
  const [positions, setPositions] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useContext(UserContext)
  const { width, height } = useWindowSize()

  const openPost = (id: string) => {
    setFocused(id)
    history.push(
      id.length != 20
        ? `/post/${id}`
        : user.logged
        ? user.displayName
          ? '/add'
          : '/profile'
        : '/login'
    )
  }

  const closePost = () => {
    setFocused('')
    history.push(previousUrl ? previousUrl : '/')
  }

  useEffect(() => {
    setMounted(true)
    // Initialized post positions
    const positions = setPos()
    setOffset(positions[1])
    setPositions(positions[0])
    return () => {
      setFocused('')
      setMounted(false)
      setRefresh(false)
    }
  }, [])

  useEffect(() => {
    const type =
      fullUrl &&
      fullUrl.split('/').length == 3 &&
      fullUrl.split('/')[1] === 'post'
        ? 'post'
        : tag
        ? tag
        : userName
        ? userName
        : ''
    ;`posts${userName ? '/user' : ''}${
      tag ? '/' + tag.trim() : userName ? '/' + userName : ''
    }`

    // Checks if url was the previous one (and is not refreshing) to avoid loading unnecessarily
    if ((type !== 'post' || !previousUrl) && (previousUrl !== url || refresh)) {
      setPositions([]) // reset position
      setIsLoading(true)

      const { cancel, setPostsContext } = getPosts(
        `posts${userName ? '/user' : ''}${
          tag ? '/' + tag.trim() : userName ? '/' + userName : ''
        }`,
        type
      )
      ;(async () => await setPostsContext())()

      if (mounted) {
        const postion = setPos()
        setOffset(postion[1])
        setPositions(postion[0])
        setIsLoading(false)
        setPreviousUrl(url)
        setRefresh(false)
      }

      return cancel
    }
  }, [refresh, tag, userName])

  return (
    <>
      <StyledPosts width={width} height={height}>
        <Suspense fallback={<Loader />}>
          {isLoading ? (
            <Loader />
          ) : (
            ids.map(
              (id, i) =>
                positions.length > i && (
                  <Post
                    key={id}
                    col={positions[i][0] + 1 + offset}
                    row={positions[i][1] + 1 + offset}
                    openPost={() => openPost(id)}
                    size={positions[i][2]}
                    {...posts[id]}
                  />
                )
            )
          )}
        </Suspense>
      </StyledPosts>
      <Route
        exact
        path="/post/:postId"
        render={({ match }) => (
          <Suspense fallback={<Loader />}>
            <Post
              dismiss={closePost}
              id={match.params.postId}
              type="standAlone"
              {...posts[focused]}
            />
          </Suspense>
        )}
      />
      <Tags />
    </>
  )
}

export default Posts
