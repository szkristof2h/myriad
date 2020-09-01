import React, { FC, useContext, useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { useForm } from "react-hook-form"
import isURL from "validator/lib/isURL"
import { ErrorContext } from "../contexts/ErrorContext"
import * as Styled from "./Submit.style"
import { Box } from "../components/Box.style"
import { Input, SubmitButton } from "../components"
import { Header, Error, Warning } from "../Typography/Typography.style"
import getYoutubeId from "../../util/getYoutubeId"
import useGetData from "../hooks/useGetData"
import usePostData from "../hooks/usePostData"

export interface PostGetMediaData {
  html: string
}
export interface PostSubmitData {
  id: string
}

interface PostSubmitVariables {
  description: string
  images: string[]
  link: string
  title: string
  tags: string
}

interface Props {}

const FIELD_NAMES = ["description", "tag", "title", "url"]

const Submit: FC<Props> = () => {
  let history = useHistory()
  const { addError } = useContext(ErrorContext)
  const {
    errors,
    formState,
    getValues,
    handleSubmit,
    register,
    setValue,
    trigger,
  } = useForm({ mode: "all", reValidateMode: "onChange" })
  const { touched: isTouched } = formState
  const { url: fieldUrl = "" } = getValues()
  const [fieldTag, setFieldTag] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [tags, setTags] = useState("")
  const idYoutube = getYoutubeId(fieldUrl)
  // TODO: add throttle
  const { data: imageData, isLoading: isMediaLoading } = useGetData<
    PostGetMediaData
  >(
    `media/${fieldUrl
      .split("")
      .map(ch => ch.charCodeAt(0))
      .join("")}`,
    { url: `${idYoutube ? idYoutube : fieldUrl}` }
  )
  const {
    isLoading: isLoadingSubmit,
    startPost: startPostRequest,
  } = usePostData<PostSubmitData, PostSubmitVariables>(`addPost`)
  const isFormEmpty = FIELD_NAMES.filter(field => getValues(field)).length === 0
  const hasRequiredFieldMissing =
    FIELD_NAMES.filter(field => errors[field]?.type === "required").length !==
      0 ||
    !selectedImages.length ||
    !tags
  const getTagsValidationError = () => {
    if (
      !tags ||
      !tags.includes(",") ||
      tags.split(",").length < 3 ||
      tags.split(",").filter(tag => tag).length < 3
    )
      return `You must give at least 3 (non-empty) tags to your post (separated by ",")!`
    if (tags.split(",").length > 30)
      return `Your post can't have more than 30 tags: please remove ${
        tags.split(",").length - 30
      } of them!`
  }
  const getValidationError = () => {
    if (isFormEmpty) return "All fields are currently empty."

    if (hasRequiredFieldMissing) return "There are missing required fields."

    if (Object.keys(errors).length > 0) return "Some fields are invalid."

    return
  }

  useEffect(() => {
    if (!isMediaLoading && fieldUrl) handleMediaChange()
  }, [isMediaLoading, fieldUrl])

  // TODO: do it without useeffect
  useEffect(() => {
    trigger("url")
  }, [images.length])

  // TODO: do it without useeffect
  useEffect(() => {
    trigger()
  }, [])

  const handleMediaChange = () => {
    const html = imageData?.html
    if (html && !idYoutube) {
      const parser = new DOMParser()
      const document = parser.parseFromString(html, "text/html")
      const images = Array.from(document.getElementsByTagName("img"))
        .map(a => a.src)
        .filter((image, i, self) => self.indexOf(image) === i)

      setImages(images)
    } else if (html) {
      const imageTemplate = `https://img.youtube.com/vi/${idYoutube}/0.jpg`
      setImages([imageTemplate])
    }

    setSelectedImages([])
  }

  const onSubmit = async formData => {
    const { description, title, url } = formData

    const variables = {
      description,
      images: selectedImages,
      link: url,
      title,
      tags,
    }

    const data = await startPostRequest(variables)

    history.push(`/post/${data?.id}`)
  }

  // TODO: figure out the point of this function
  const removeNotExistingSelectedImages = () => {
    const notExistingImages = selectedImages.filter(
      image => !images.includes(image)
    )

    if (notExistingImages.length > 0)
      setImages(
        selectedImages.filter(image => notExistingImages.includes(image))
      )
  }

  const handleSelect = (e: React.MouseEvent, clickedImage: string) => {
    e.preventDefault()

    if (selectedImages.length === 10)
      addError("submitImageSelect", "You can't select more than 10 images!")
    else
      setSelectedImages(
        selectedImages.includes(clickedImage)
          ? selectedImages.filter(image => image !== clickedImage)
          : [...selectedImages, clickedImage]
      )
  }

  const handleOnImageLoad = ({ target: image }, index: number) => {
    if (
      !images[index].includes("https://img.youtube.com/vi/") &&
      (image.naturalWidth < 500 || image.naturalHeight < 500)
    ) {
      setImages(images.filter((_, i) => i !== index))
      setSelectedImages(selectedImages.filter((_, i) => i !== index))
    }
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      if (fieldTag.length < 3)
        // move to validation?
        addError("submitTags", "All tags should be at least 3 character long")
      else if (fieldTag)
        setTags(
          [...new Set([...tags.split(","), ...fieldTag.split(",")])]
            .filter(tag => tag)
            .join(",")
        )
    }
  }

  const handleOnImageError = (image: string) => {
    setImages(images.filter(img => img !== image))
    setSelectedImages(selectedImages.filter(img => img !== image))
  }

  return (
    <Box style={{ width: "100%" }}>
      <Styled.Submit>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Header size={2} centered>
            Submit a post!
          </Header>
          <Header size={1} centered>
            Title
          </Header>
          <Input
            hasError={isTouched.title && errors.title}
            isRequired
            maxLength={50}
            message={
              errors.title
                ? errors.title?.type === "required"
                  ? "This field is required"
                  : errors.title?.type === "minLength"
                  ? "Title should be at least 3 characters long."
                  : "Title should be no more than 50 characters long."
                : ""
            }
            minLength={3}
            name="title"
            register={register}
          />
          <Header size={1} centered>
            Description
          </Header>
          <Input
            name="description"
            hasError={isTouched.description && errors.description}
            isRequired
            maxLength={300}
            message={
              errors.description
                ? errors.description?.type === "required"
                  ? "This field is required"
                  : errors.description?.type === "minLength"
                  ? "Description should be at least 10 characters long."
                  : "Description should be no more than 300 characters long."
                : ""
            }
            minLength={10}
            register={register}
          />
          <Header size={1} centered>
            Link (to the original post)
          </Header>
          <Input
            hasError={isTouched.url && errors.url}
            isRequired
            message={
              errors.url
                ? errors.url?.type === "required"
                  ? "This field is required."
                  : errors.url?.type === "isUrl"
                  ? "This URL is not valid."
                  : "This URL doesn't have any valid images."
                : ""
            }
            name="url"
            placeholder="Will automatically load images from the url to choose from"
            register={register}
            validate={{
              isUrl: value => isURL(value),
              hasNoValidImage: value =>
                value && images.length !== 0 && !isMediaLoading,
            }}
          />
          {images.length !== 0 && (
            <Header size={1} centered>
              Choose an image
            </Header>
          )}
          {errors.url?.type === "hasNoValidImage" && (
            <Error>
              Couldn't find any images on the url (you can instead add your own
              choice of url below).
              <br /> Only images bigger than 500*500 px are valid.
            </Error>
          )}
          {isMediaLoading && (
            <Warning size={1} centered>
              Loading images from {fieldUrl}...
            </Warning>
          )}
          {images.map((image, i) => (
            <Styled.ImageContainer
              isActive={!!selectedImages.includes(image)}
              as={Link}
              key={image}
              onClick={e => handleSelect(e, image)}
              to=""
            >
              <img
                onError={() => handleOnImageError(image)}
                onLoad={e => handleOnImageLoad(e, i)}
                src={image}
              />
            </Styled.ImageContainer>
          ))}
          {images.length > 0 && selectedImages.length === 0 && fieldUrl && (
            <Error>You should select at least 1 image.</Error>
          )}
          <Header size={1} centered>
            Tags
          </Header>
          {(fieldTag || tags) && (
            <Styled.TagList>
              {tags
                .split(",")
                .filter(tag => tag)
                .map(tag => (
                  <li
                    key={tag}
                    onClick={() =>
                      setTags(
                        tags
                          .split(",")
                          .filter(tag => tag !== tag)
                          .join(",")
                      )
                    }
                  >
                    {tag}
                  </li>
                ))}
            </Styled.TagList>
          )}
          <Input
            hasError={isTouched.tag && !!getTagsValidationError()}
            message={getTagsValidationError()}
            name="tag"
            onChange={e => {
              if (e.currentTarget.value.slice(-1) !== ",")
                setFieldTag(e.currentTarget.value)
              else setValue("tag", "")
            }}
            onKeyPress={e => handleTagInput(e)}
            register={register}
          />
          <SubmitButton
            buttonType="primary"
            isDisabled={!!getValidationError()}
            isLoading={isLoadingSubmit}
            type="submit"
          >
            Post
          </SubmitButton>
        </form>
      </Styled.Submit>
    </Box>
  )
}

export default Submit
