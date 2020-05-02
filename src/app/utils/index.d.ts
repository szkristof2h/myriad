interface Error {
  message: string
  type: string
}
export interface APIResponseError {
  error?: Error
}
