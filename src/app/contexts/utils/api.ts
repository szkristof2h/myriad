import axios from 'axios'
import config from '../../config'

const siteUrl = config.url
const get = async (url: string, handleErrors) => {
  let data
  let cancel
  let hasFailed

  try {
    const source = axios.CancelToken.source()
    data = await axios.get(`${siteUrl}/get/${url}`, {
      cancelToken: source.token,
    })

    cancel = () => source.cancel()
  } catch (e) {
    if (!axios.isCancel(e))
      handleErrors()
    hasFailed = true
  }

  return { data, cancel, hasFailed }
}

export { get }
