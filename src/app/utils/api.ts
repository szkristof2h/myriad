import axios, { AxiosResponse, Canceler } from 'axios'
import config from '../config'

export interface APIRequestInteface<T> {
  getData: () => Promise<AxiosResponse<T> | undefined>
  cancel: Canceler
  getHasFailed: () => boolean
}

const siteUrl = config.url
const get = <T = any, R = AxiosResponse<T>>(url: string, handleErrors) => {
  let hasFailed
  const getHasFailed = () => hasFailed
  const source = axios.CancelToken.source()
  const cancel = () => source.cancel()

  const data = async () => {
    try {
      const getData: Promise<R> = axios.get(`${siteUrl}/get/${url}`, {
        cancelToken: source.token,
      })

      // TODO: it should return data
      return await getData
    } catch (e) {
      if (!axios.isCancel(e)) handleErrors()
      hasFailed = true
    }
  }

  return { getData: data, cancel, getHasFailed }
}

const post = <T = any, R = AxiosResponse<T>>(url: string, variables, handleErrors) => {
  let hasFailed
  const getHasFailed = () => hasFailed
  const source = axios.CancelToken.source()
  const cancel = () => source.cancel()
  const data = async () => {
    try {
      const getData: Promise<R> = axios.post(
        `${siteUrl}/post/${url}`,
        variables,
        {
          cancelToken: source.token,
        }
      )

      // TODO: it should return data
      return await getData
    } catch (e) {
      if (!axios.isCancel(e)) handleErrors()
      hasFailed = true
    }
  }

  return { getData: data, cancel, getHasFailed }
}

export { get, post }