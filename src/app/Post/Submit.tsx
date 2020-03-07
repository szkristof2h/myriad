import React, { FC, useContext, useEffect, useState, useReducer } from "react"
import { Link, useHistory } from "react-router-dom"
import isURL from "validator/lib/isURL"
import { ErrorContext } from "../contexts/ErrorContext"
import StyledSubmit from "./Submit.style"
import { Box } from "../components/Box.style"
import { Input } from "../components"
import { Button, ButtonError } from "../components/Button.style"
import { Header, Error, Warning } from "../Typography/Typography.style"
import getYoutubeId from "../../util/getYoutubeId"
import { post, APIRequestInteface } from "../utils/api"
import validateField from "./utils"
import { PostData } from "../contexts/PostsContext"

interface PostGetImagesInterface
  extends APIRequestInteface<PostGetImagesData> {}
interface PostSubmitInterface extends APIRequestInteface<PostSubmitData> {}
export interface PostGetImagesData {
  html: any
  error?: {}
}
export interface PostSubmitData {
  post: PostData
  error?: {}
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
  | "customImage"
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
  images: [""],
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
      return { ...state, newTag: action.payload }
    case "changeTags":
      return { ...state, tags: action.payload }
    case "changeTitle":
      return { ...state, fieldTitle: action.payload }
    case "changeUrl":
      return { ...state, url: action.payload }
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
  customImage: [""],
  description: [""],
  images: [""],
  tag: [""],
  selectedImages: [""],
  tags: [""],
  title: [""],
  url: [""],
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
  } = state
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [validationMessage, setValidationMessage] = useState<{
    [key: string]: string[]
  }>(initialValidationMessages)
  const { addError } = useContext(ErrorContext)

  // Move this to input change
  useEffect(() => {
    const validationError: string[] = []

    if (isURL(fieldUrl) && !isImageLoading) {
      const videoId = getYoutubeId(fieldUrl)
      if (!videoId) {
        setIsImageLoading(true)
        const { getData, cancel, getHasFailed }: PostGetImagesInterface = post<
          PostGetImagesData
        >("/get/images", { url: fieldUrl }, () =>
          addError({ submitImageLoading: ["some error message here"] })
        )
        ;(async () => {
          const response = await getData()
          if (getHasFailed() || !response)
            return addError({
              submitImageLoading: [`post get images request failed`],
            })

          const {
            data: { error, html },
          } = response

          if (error) return addError(error)

          const parser = new DOMParser()
          const wrapper = parser.parseFromString(html, "text/html")
          // @ts-ignore
          const imgs = [...wrapper.getElementsByTagName("img")]
            .map(a => a.src)
            .filter((img, i, self) => self.indexOf(img) === i)
          dispatch({ type: "changeImages", payload: imgs })
          setIsImageLoading(false)
        })()

        return cancel
      } else {
        const imageTemplate = `https://img.youtube.com/vi/${videoId}/0.jpg`
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
  }, [fieldUrl])

  useEffect(() => {
    // rest form
    dispatch({ type: "reset" })
    // initialize validation errors
    const validationErrors = {}
    Object.keys(validationMessage).forEach(key => {
      const field = state["field" + key.slice(0, 1).toUpperCase + key.slice(1)]
      // @ts-ignore
      const validationError = validateField(key, [field, "", ""])
      validationErrors[key] = validationError
    })
  }, [])

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    const isValid =
      Object.keys(validationMessage).filter(key => validationMessage[key])
        .length === 0

    if (!isValid) return addError({ submit: ["Some fields aren't valid"] })

    const data = {
      description: fieldDescription,
      images: fieldSelectedImages,
      link: fieldUrl,
      title: fieldTitle,
      tags,
    }

    setIsImageLoading(true)
    const { getData, cancel, getHasFailed }: PostSubmitInterface = post<
      PostSubmitData
    >("/submit", data, () => addError({ submit: ["some error message here"] }))
    ;(async () => {
      const response = await getData()
      if (getHasFailed() || !response)
        return addError({ submit: [`post submit post request failed`] })

      const {
        data: { error, post },
      } = response

      if (error) return addError(error)
      history.push(`/submit/${post.id}`)
    })()
  }

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    actionType: ActionType["type"],
    validationType: FieldTypes
  ) => {
    dispatch({
      type: actionType,
      payload: e.currentTarget.value,
    })

    const validationErrors = validateField(validationType, [
      state[
        "field" +
          validationType.slice(0, 1).toUpperCase +
          validationType.slice(1)
      ],
    ])

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

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      addError({ submitImage: [validationErrors.images[0]] })
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
      addError({ submitImageSelect: [validationErrors.selectedImages[0]] })
    else {
      dispatch({
        type: "changeSelectedImages",
        payload: images.includes(clickedImage)
          ? images.filter(image => image !== clickedImage)
          : [...images, clickedImage],
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
        payload: images.filter(img => img !== index),
      })
      dispatch({
        type: "changeSelectedImages",
        payload: images.filter(img => img !== index),
      })
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    const validationErrors = validateField("tags", [tags])

    setValidationMessage({ ...validationMessage, ...validationErrors })
    dispatch({
      type: "removeTag",
      payload: tags
        .split(",")
        .filter(tag => tag !== tagToRemove)
        .join(","),
    })
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const validationErrors = validateField("tags", [tags])

    setValidationMessage({ ...validationMessage, ...validationErrors })
    if (e.key === "," || e.key === "Enter") {
      if (fieldTag.length < 3)
        // move to validation?
        addError({
          submitTags: ["All tags should be at least 3 character long"],
        })
      else {
        if (fieldTag && !tags.split(",").includes(fieldTag))
          dispatch({
            type: "changeTags",
            payload: `${tags ? `${tags}","` : ""}${fieldTag}`,
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
      payload: images.filter(img => img !== image),
    })
  }

  return (
    <Box style={{ width: "100%" }}>
      <StyledSubmit>
        <Header className="header" size={2} centered>
          Submit a post!
        </Header>
        <Header className="label" size={1} centered>
          Title
        </Header>
        <Input
          className="input input--text"
          onChange={e => handleInput(e, "changeTitle", "title")}
          value={fieldTitle}
        />
        <Header className="label" size={1} centered>
          Description
        </Header>
        <Input
          className="input input--text"
          onChange={e => handleInput(e, "changeDescription", "description")}
          value={fieldDescription}
        />
        <Header className="label" size={1} centered>
          Link (to the original post)
        </Header>
        <Input
          className="input input--text"
          onChange={e => handleInput(e, "changeUrl", "url")}
          placeholder="Will automatically load images from the url to choose from"
          value={fieldUrl}
        />
        {images.length !== 0 && (
          <Header className="label" size={1} centered>
            Choose an image
          </Header>
        )}
        {images.length === 0 && fieldUrl && !isImageLoading && (
          <Error className="image-text">
            Couldn't find any images on the url (you can instead add your own
            choice of url below).
            <br /> Only images bigger than 500*500 px are valid.
          </Error>
        )}
        {isImageLoading && (
          <Warning className="label" size={1} centered>
            Loading images from {fieldUrl}...
          </Warning>
        )}
        {images.map(image => (
          <Link
            key={image}
            className={`image-container ${
              fieldSelectedImages.includes(image)
                ? "image-container--active"
                : ""
            }`}
            onClick={e => handleSelect(e, image)}
            to=""
          >
            <img
              onError={() => handleOnImageError(image)}
              onLoad={e => handleOnImageLoad(e, image)}
              className="image"
              src={image}
            />
          </Link>
        ))}
        {fieldUrl && (
          <Header className="label" size={1} centered>
            Image (url)
          </Header>
        )}
        {fieldUrl && (
          <Input
            className="input input--text"
            onChange={e => handleImageInput(e)}
            placeholder="Add a custom image or choose from above (after filling link)"
            value={fieldCustomImage}
          />
        )}
        <Header className="label" size={1} centered>
          Tags
        </Header>
        {fieldTag && (
          <ul className="input input--text tag-list">
            {fieldTag
              .split(",")
              .filter(tag => tag)
              .map(tag => (
                <li
                  key={tag}
                  className="tag"
                  onClick={() => handleTagRemove(tag)}
                >
                  {tag}
                </li>
              ))}
          </ul>
        )}
        <Input
          className="input input--text input--tags"
          onChange={e =>
            e.currentTarget.value.slice(-1) !== "," &&
            handleInput(e, "changeTag", "tag")
          }
          onKeyPress={e => handleTagInput(e)}
          value={fieldTag}
        />
        {Object.keys(validationMessage).filter(k => validationMessage[k])
          .length !== 0 ? (
          <ButtonError as="ul" className="button">
            {validationMessage.title?.map(e => (
              <li key={e} className="error">
                {e}
              </li>
            ))}
            {validationMessage.description.map(e => (
              <li key={e} className="error">
                {e}
              </li>
            ))}
            {fieldUrl &&
              validationMessage.images.map(e => (
                <li key={e} className="error">
                  {e}
                </li>
              ))}
            {validationMessage.url.map(e => (
              <li key={e} className="error">
                {e}
              </li>
            ))}
            {validationMessage.tags.map(e => (
              <li key={e} className="error">
                {e}
              </li>
            ))}
          </ButtonError>
        ) : (
          <Button
            as={Link}
            className={"button"}
            onClick={e => handleSubmit(e)}
            to="/add"
          >
            Post
          </Button>
        )}
      </StyledSubmit>
    </Box>
  )
}

export default Submit
