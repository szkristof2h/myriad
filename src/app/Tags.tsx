import React, { useContext, useEffect, useState } from "react"
import { get, APIRequestInteface } from "./utils/api"
import { Link } from "react-router-dom"
import { ErrorContext } from "./contexts/ErrorContext"
import { StyledTags } from "./Tags.style"

interface TagsDataInterface extends APIRequestInteface<GetTagsData> {}

interface GetTagsData {
  ids: string[]
  tags: string[]
}

const Tags = () => {
  const [tags, setTags] = useState<string[]>([])
  const { addError } = useContext(ErrorContext)

  const getTags = () => {
    const { getData, cancel, getHasFailed }: TagsDataInterface = get(
      "tags",
      () => addError({ tags: ["some error message here"] })
    )

    const setAllTags = async () => {
      const response = await getData()

      if (getHasFailed() || !response)
        return addError({ posts: [`get posts request failed`] })

      const {
        data: { error, tags: tagsData },
      } = response

      if (error) return addError(error.message, error.type)
      console.log(tagsData)
      setTags(tagsData)
    }

    return { cancel, setAllTags }
  }

  useEffect(() => {
    const { cancel, setAllTags } = getTags()

    ;(async () => await setAllTags())()

    return cancel
  }, [])

  return (
    <StyledTags className="tags">
      {tags?.map((tag) => (
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
