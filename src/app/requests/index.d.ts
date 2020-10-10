interface Error {
  message: string
  shouldShow?: boolean
  type: string
}
export interface APIResponseError {
  error?: Error
}
