import axios, { AxiosResponse, Canceler } from "axios"
import { APIResponseError } from "."
import config from "../config"

export interface APIRequestInteface<T> {
  getData: () => Promise<AxiosResponse<T & APIResponseError> | undefined>
  cancel: Canceler
  getHasFailed: () => boolean
}

export interface APIPostRequestInteface<T> {
  postData: () => Promise<AxiosResponse<T & APIResponseError> | undefined>
  cancel: Canceler
  getHasFailed: () => boolean
}

const siteUrl = config.url
const get = <T = any, V = any, R = AxiosResponse<T & APIResponseError>>(
  url: string,
  handleErrors,
  params?: V
) => {
  let hasFailed: boolean
  const getHasFailed = () => hasFailed
  const source = axios.CancelToken.source()
  const cancel = () => source.cancel()
  const data = async () => {
    try {
      const getData: Promise<R> = params
        ? axios.post(`${siteUrl}/get/${url}`, params, {
            cancelToken: source.token,
          })
        : axios.get(`${siteUrl}/get/${url}`, {
            cancelToken: source.token,
          })

      return await getData
    } catch (e) {
      if (!axios.isCancel(e)) handleErrors()
      hasFailed = true
    }
  }

  return { getData: data, cancel, getHasFailed }
}

const post = <T = any, V = any, R = AxiosResponse<T>>(
  url: string,
  variables: V,
  handleErrors
) => {
  let hasFailed: boolean = false
  const getHasFailed = () => hasFailed
  const source = axios.CancelToken.source()
  const cancel = () => source.cancel()
  const data = async () => {
    try {
      const postData: Promise<R> = axios.post(
        `${siteUrl}/post/${url}`,
        variables,
        {
          cancelToken: source.token,
        }
      )

      return await postData
    } catch (e) {
      if (!axios.isCancel(e)) handleErrors()
      hasFailed = true
    }
  }

  return { postData: data, cancel, getHasFailed }
}

export { get, post }
