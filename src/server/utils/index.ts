import { NextFunction, Request, Response } from "express"
import sanitizeHtml from "sanitize-html"

export function toObject(arr, key) {
  return arr === null || arr.length === 0
    ? {}
    : Object.assign({}, ...arr.map(item => ({ [item[key]]: item })))
}

const setErrorType = (res: Response, type) => {
  res.locals.errorType = type
}

const setResponseData = <T>(res: Response, data: T) => {
  res.dataToSendBack = data
}

// TODO: fix formatting
export function handleErrors(
  error: { message: string },
  req: Request,
  res: Response,
  next: NextFunction
) {
  const type = res.locals.errorType
  console.warn(type)
  console.warn(error)
  // const errorB = {
  //   text: error.message
  // }
  // console.warn(JSON.stringify(errorB, null, 2))

  if (!error) next()

  // const formattedError = {
  //   error:
  //     error?.error
  //       ? [error.error]
  //       : error && error.errors
  //       ? Object.keys(error.errors).map(
  //           key =>
  //             `Value for '${key}' is not valid: ${error.errors[key].message} `
  //         )
  //       : error,
  //   type,
  // }

  const publicError = {
    error: {
      message: error.message,
      shouldShow: true,
      type,
    },
  }

  res.json(publicError)
}

export function sanitize(text: string) {
  return sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} })
}

export { setErrorType, setResponseData }
