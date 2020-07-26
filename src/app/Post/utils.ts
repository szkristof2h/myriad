import { FieldTypes } from "./Submit"

const validateField = (type: FieldTypes, fields) => {
  const errors: { [type: string]: string[] } = { [type]: [] }

  switch (type) {
    case "description":
      if (!fields[0])
        errors[type] = [
          ...errors[type],
          "You must give your post a description!",
        ]
      if (fields[0].length < 3)
        errors[type] = [
          ...errors[type],
          "The description should be at least 3 characters long!",
        ]
      if (fields[0].length > 300)
        errors[type] = [
          ...errors[type],
          "The description shouldn't be more than 300 characters long!",
        ]
      break
    case "images":
      if (fields[0] && fields[0]?.includes(fields[1] ?? ""))
        errors[type] = [...errors[type], "Image is already on the list."]
      else if (fields[2].length > 9)
        errors[type] = [
          ...errors[type],
          "You can only have 10 images for your post.",
        ]
      break
    case "selectedImages":
      if (fields[0].length === 0)
        errors[type] = [...errors[type], "Your post needs at least 1 image."]
      else if (fields[0].length > 9 && !fields[0].includes(fields[1]))
        errors[type] = [
          ...errors[type],
          "You can't select more than 10 images!",
        ]
      break
    case "tags":
      const [tags] = fields
      if (
        !tags ||
        !tags.includes(",") ||
        tags.split(",").length < 3 ||
        tags.split(",").filter(tag => tag).length < 3
      )
        errors[type] = [
          ...errors[type],
          'You must give at least 3 (non-empty) tags to your post (separated by ",")!',
        ]
      else if (tags.split(",").length > 30)
        errors[type] = [
          ...errors[type],
          `Your post can't have more than 30 tags: please remove ${
            tags.split(",").length - 30
          } of them!`,
        ]
      break
    case "title":
      const [title] = fields
      if (!title)
        errors[type] = [...errors[type], "You must give your post a title!"]
      if (title.length < 3)
        errors[type] = [
          ...errors[type],
          "The title should be at least 3 characters long!",
        ]
      if (title.length > 50)
        errors[type] = [
          ...errors[type],
          "The title shouldn't be more than 50 characters long!",
        ]
      break
    default:
      ""
  }

  return errors
}

export default validateField
