import React from "react"
import { Link } from "react-router-dom"
import { StyledTags } from "./Tags.style"
import useGetData from "./hooks/useGetData"

interface GetTagsData {
  tags: string[]
}

const Tags = () => {
  const { data, isLoading } = useGetData<GetTagsData>("tags")
  const tags = data?.tags

  return (
    <StyledTags className="tags">
      {tags?.map(tag => (
        <li key={`tag:${tag}`} className="tag">
          <Link className="tag__link" to={`/tag/${tag}`}>
            #{tag.trim()}
          </Link>
        </li>
      ))}
    </StyledTags>
  )
}

export default Tags
