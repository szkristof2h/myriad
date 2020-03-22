import sanitizeHtml from "sanitize-html"

export function toObject(arr, key) {
  return arr === null || arr.length === 0
    ? {}
    : Object.assign({}, ...arr.map(item => ({ [item[key]]: item })))
}

export function handleErrors(type, error) {
  console.warn(type)
  console.warn(error)

  return {
    errors:
      error && error.error
        ? [error.error]
        : error && error.errors
        ? Object.keys(error.errors).map(
            key =>
              `Value for '${key}' is not valid: ${error.errors[key].message} `
          )
        : error,
    type,
  }
}

export function sanitize(text) {
  return sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} })
}
