import React, { useContext, useEffect, useState } from 'react'
import { Canceler } from 'axios'
import { get } from './utils/api.js'
import { Link } from 'react-router-dom'
import { ErrorContext } from './contexts/ErrorContext.jsx'
import { StyledTags } from './Tags.style.js'

export interface TagsDataInterface {
  getData: Promise<{
    tags: string[]
    errors?: {}
  }>
  cancel: Canceler
  getHasFailed: () => boolean
}
export default function Tags() {
  const [tags, setTags] = useState<string[]>([]);
  const { setErrors } = useContext(ErrorContext);

  const getTags = () => {
    const { getData, cancel, getHasFailed }: TagsDataInterface = get(
      'tags',
      () => setErrors(errors => [...errors, 'some error message here'])
    )

    const setAllTags = async () => {
      const { errors, tags: tagsData } = await getData

      if (errors) setErrors(errors => [...errors, errors])
      else if (!getHasFailed) {
        setTags(tagsData)
      }
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
      {tags.map(tag => (
        <li key={`tag:${tag}`} className="tag">
          <Link className="tag__link" to={`/tag/${tag}`}>
            #{tag.trim()}
          </Link>
        </li>
      ))}
    </StyledTags>
  )
}
