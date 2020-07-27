import React, { FC, useContext, useEffect, useState, useReducer } from "react"
import { Link, useHistory } from "react-router-dom"
import isURL from "validator/lib/isURL"
import { ErrorContext } from "../contexts/ErrorContext"
import StyledSubmit, { TagList, ImageContainer } from "./Submit.style"
import { Box } from "../components/Box.style"
import { Input, Button } from "../components"
import { Header, Error, Warning } from "../Typography/Typography.style"
import getYoutubeId from "../../util/getYoutubeId"
import validateField from "./utils"
import { PostData } from "../contexts/PostsContext"
import useGetData from "../hooks/useGetData"
import usePostData from "../hooks/usePostData"

export interface PostGetMediaData {
  html: string
}
export interface PostSubmitData {
  post: PostData
}

interface PostSubmitVariables {
  description: string
  images: string[]
  link: string
  title: string
  tags: string
}

interface Props {}

interface SubmitFields {
  fieldCustomImage: string
  fieldDescription: string
  fieldTag: string
  fieldSelectedImages: string[]
  fieldTitle: string
  fieldUrl: string
  images: string[]
  tags: string
}

interface ActionType {
  type:
    | "changeCustomImage"
    | "changeDescription"
    | "changeImages"
    | "changeTag"
    | "changeSelectedImages"
    | "changeTags"
    | "changeTitle"
    | "changeUrl"
    | "removeTag"
    | "reset"
  payload?: any
}

export type FieldTypes =
  | "description"
  | "images"
  | "tag"
  | "selectedImages"
  | "tags"
  | "title"
  | "url"

const initialState: SubmitFields = {
  fieldCustomImage: "",
  fieldDescription: "",
  fieldTag: "",
  fieldSelectedImages: [],
  fieldTitle: "",
  fieldUrl: "",
  images: [],
  tags: "",
}

const reducer = (state: SubmitFields, action: ActionType) => {
  switch (action.type) {
    case "changeCustomImage":
      return { ...state, fieldCustomImage: action.payload }
    case "changeDescription":
      return { ...state, fieldDescription: action.payload }
    case "changeImages":
      return { ...state, images: action.payload }
    case "changeTag":
      return { ...state, fieldTag: action.payload }
    case "changeSelectedImages":
      return { ...state, fieldSelectedImages: action.payload }
    case "changeTags":
      return { ...state, tags: action.payload }
    case "changeTitle":
      return { ...state, fieldTitle: action.payload }
    case "changeUrl":
      return { ...state, fieldUrl: action.payload }
    case "removeTag":
      return {
        ...state,
        tags: state.tags
          .split(",")
          .filter(tag => tag !== action.payload)
          .join(","),
      }
    case "reset":
      return initialState
    default:
      return state
  }
}

// quick fix for type errors
const initialValidationMessages = {
  customImage: [],
  description: [],
  images: [],
  tag: [],
  selectedImages: [],
  tags: [],
  title: [],
  url: [],
}

const Submit: FC<Props> = () => {
  let history = useHistory()
  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    fieldCustomImage,
    fieldDescription,
    fieldTag,
    fieldSelectedImages,
    fieldTitle,
    fieldUrl,
    images,
    tags,
  }: SubmitFields = state
  const [validationMessage, setValidationMessage] = useState<{
    [key: string]: string[]
  }>(initialValidationMessages)
  const { addError } = useContext(ErrorContext)
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
    data: submitData,
    isLoading: isLoadingSubmit,
    startPost: startPostRequest,
  } = usePostData<PostSubmitData, PostSubmitVariables>(`submit`)
  const requiredFields = [
    "fieldDescription",
    "fieldSelectedImages",
    "fieldTitle",
    "fieldTag",
    "fieldUrl",
  ]
  const isFormEmpty =
    !fieldCustomImage &&
    !fieldDescription &&
    !fieldTag &&
    !fieldSelectedImages.length &&
    !fieldTitle &&
    !fieldUrl &&
    !images.length &&
    !tags
  const hasRequiredFieldMissing = requiredFields.some(
    fieldName => !state[fieldName]
  )

  useEffect(() => {
    dispatch({ type: "reset" })
    const validationErrors = {}

    Object.keys(validationMessage).forEach(key => {
      const fieldName = "field" + key.slice(0, 1).toUpperCase() + key.slice(1)
      const value = state[fieldName]
      // @ts-ignore
      const validationError = validateField(key, [value, "", ""])
      validationErrors[key] = validationError
    })
  }, [])

  useEffect(() => {
    if (!isMediaLoading && fieldUrl) {
      handleMediaChange(fieldUrl)
    }
  }, [isMediaLoading, fieldUrl])

  const handleMediaChange = (url: string) => {
    const validationError: string[] = []

    if (isURL(url)) {
      const html = imageData?.html
      if (html && !idYoutube) {
        const parser = new DOMParser()
        const document = parser.parseFromString(html, "text/html")
        const images = Array.from(document.getElementsByTagName("img"))
          .map(a => a.src)
          .filter((image, i, self) => self.indexOf(image) === i)

        dispatch({ type: "changeImages", payload: images })
      } else if (html) {
        const imageTemplate = `https://img.youtube.com/vi/${idYoutube}/0.jpg`
        dispatch({ type: "changeImages", payload: [imageTemplate] })
      }
    } else {
      dispatch({ type: "changeImages", payload: [] })
      validationError.push("You must give your post a valid url!")
    }

    validationError.length
      ? setValidationMessage({ ...validationMessage, url: validationError })
      : setValidationMessage({ ...validationMessage, url: [] })
    dispatch({ type: "changeSelectedImages", payload: [] })
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()

    const isValid =
      Object.keys(validationMessage).filter(key => validationMessage[key])
        .length === 0

    if (!isValid) return addError("submit", "Some fields aren't valid")

    const data = {
      description: fieldDescription,
      images: fieldSelectedImages,
      link: fieldUrl,
      title: fieldTitle,
      tags,
    }

    await startPostRequest(data)

    history.push(`/submit/${submitData?.post.id}`)
  }

  const handleInput = (
    e: React.FormEvent<HTMLInputElement>,
    actionType: ActionType["type"],
    validationType: FieldTypes
  ) => {
    const value = e.currentTarget.value
    dispatch({
      type: actionType,
      payload: value,
    })

    const fieldName = `field${validationType
      .slice(0, 1)
      .toUpperCase()}${validationType.slice(1)}`
    const validationErrors = validateField(validationType, [value])

    setValidationMessage({ ...validationMessage, ...validationErrors })
  }

  const removeNotExistingSelectedImages = () => {
    const notExistingimages = fieldSelectedImages.filter(
      image => !images.includes(image)
    )

    if (notExistingimages.length > 0)
      dispatch({
        type: "changeImages",
        payload: fieldSelectedImages.filter(image =>
          notExistingimages.includes(image)
        ),
      })
  }

  const handleImageInput = (e: React.FormEvent<HTMLInputElement>) => {
    const newImage = e.currentTarget.value
    const validationErrors = validateField("images", [
      images,
      newImage,
      fieldSelectedImages,
    ])
    setValidationMessage({ ...validationMessage, ...validationErrors })

    removeNotExistingSelectedImages()

    if (!isURL(newImage))
      dispatch({
        type: "changeCustomImage",
        payload: [newImage],
      })
    // TODO: should save errors to variables
    else if (
      validationErrors.images[0] === "Image is already on the list." ||
      validationErrors.images[0] ===
        "You can only have 10 images for your post."
    ) {
      dispatch({
        type: "changeCustomImage",
        payload: "",
      })
      addError("submitImage", validationErrors.images[0])
    } else {
      dispatch({ type: "changeCustomImage", payload: "Image added." })
      dispatch({ type: "changeImages", payload: [...images, newImage] })
      dispatch({
        type: "changeSelectedImages",
        payload: [...fieldSelectedImages, newImage],
      })
    }
  }

  const handleSelect = (e: React.MouseEvent, clickedImage: string) => {
    e.preventDefault()
    const validationErrors = validateField("selectedImages", [
      fieldSelectedImages,
      clickedImage,
    ])
    setValidationMessage({ ...validationMessage, ...validationErrors })

    if (
      validationErrors.selectedImages[0] ===
      "You can't select more than 10 images!"
    )
      addError("submitImageSelect", validationErrors.selectedImages[0])
    else {
      dispatch({
        type: "changeSelectedImages",
        payload: fieldSelectedImages.includes(clickedImage)
          ? fieldSelectedImages.filter(image => image !== clickedImage)
          : [...fieldSelectedImages, clickedImage],
      })
    }
  }

  const handleOnImageLoad = ({ target: image }, index: number) => {
    if (
      !images[index].includes("https://img.youtube.com/vi/") &&
      (image.naturalWidth < 500 || image.naturalHeight < 500)
    ) {
      dispatch({
        type: "changeImages",
        payload: images.filter((img, i) => i !== index),
      })
      dispatch({
        type: "changeSelectedImages",
        payload: fieldSelectedImages.filter((img, i) => i !== index),
      })
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    const validationErrors = validateField("tags", [tags])

    setValidationMessage({ ...validationMessage, ...validationErrors })

    dispatch({
      type: "removeTag",
      payload: tagToRemove,
    })
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const validationErrors = validateField("tags", [tags])

    setValidationMessage({ ...validationMessage, ...validationErrors })
    if (e.key === "," || e.key === "Enter") {
      if (fieldTag.length < 3)
        // move to validation?
        addError("submitTags", "All tags should be at least 3 character long")
      else {
        if (fieldTag && !tags.split(",").includes(fieldTag))
          dispatch({
            type: "changeTags",
            payload: `${tags ? `${tags},` : ""}${fieldTag}`,
          })

        dispatch({
          type: "changeTag",
          payload: "",
        })
      }
    }
  }

  const handleOnImageError = (image: string) => {
    dispatch({
      type: "changeImages",
      payload: images.filter(img => img !== image),
    })
    dispatch({
      type: "changeSelectedImages",
      payload: fieldSelectedImages.filter(img => img !== image),
    })
  }

  return (
    <Box style={{ width: "100%" }}>
      <StyledSubmit>
        <Header size={2} centered>
          Submit a post!
        </Header>
        <Header size={1} centered>
          Title
        </Header>
        <Input
          onChange={e => handleInput(e, "changeTitle", "title")}
          value={fieldTitle}
        />
        <Header size={1} centered>
          Description
        </Header>
        <Input
          onChange={e => handleInput(e, "changeDescription", "description")}
          value={fieldDescription}
        />
        <Header size={1} centered>
          Link (to the original post)
        </Header>
        <Input
          onChange={e => handleInput(e, "changeUrl", "url")}
          placeholder="Will automatically load images from the url to choose from"
          value={fieldUrl}
        />
        {images.length !== 0 && (
          <Header size={1} centered>
            Choose an image
          </Header>
        )}
        {images.length === 0 && fieldUrl && !isMediaLoading && (
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
          <ImageContainer
            isActive={!!fieldSelectedImages.includes(image)}
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
          </ImageContainer>
        ))}
        {fieldUrl && (
          <Header size={1} centered>
            Image (url)
          </Header>
        )}
        {fieldUrl && (
          <Input
            onChange={e => handleImageInput(e)}
            placeholder="Add a custom image or choose from above (after filling link)"
            value={fieldCustomImage}
          />
        )}
        <Header size={1} centered>
          Tags
        </Header>
        {(fieldTag || tags) && (
          <TagList>
            {tags
              .split(",")
              .filter(tag => tag)
              .map(tag => (
                <li key={tag} onClick={() => handleTagRemove(tag)}>
                  {tag}
                </li>
              ))}
          </TagList>
        )}
        <Input
          onChange={e =>
            e.currentTarget.value.slice(-1) !== "," &&
            handleInput(e, "changeTag", "tag")
          }
          onKeyPress={e => handleTagInput(e)}
          value={fieldTag}
        />
        {!isFormEmpty &&
        Object.keys(validationMessage).filter(k => validationMessage[k].length)
          .length !== 0 ? (
          <Button type="danger" to="">
            {validationMessage.title?.map(e => (
              <li key={e}>{e}</li>
            ))}
            {validationMessage.description.map(e => (
              <li key={e}>{e}</li>
            ))}
            {fieldUrl &&
              validationMessage.images.map(e => <li key={e}>{e}</li>)}
            {validationMessage.url.map(e => (
              <li key={e}>{e}</li>
            ))}
            {validationMessage.tags.map(e => (
              <li key={e}>{e}</li>
            ))}
          </Button>
        ) : (
          !isFormEmpty &&
          hasRequiredFieldMissing && (
            <Button
              type="primary"
              isLoading={isLoadingSubmit}
              onClick={e => handleSubmit(e)}
              to="/add"
            >
              Post
            </Button>
          )
        )}
      </StyledSubmit>
    </Box>
  )
}

export default Submit
