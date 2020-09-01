import { useEffect, useState, useContext } from "react"
import { post, APIPostRequestInteface } from "../requests/api"
import { ErrorContext } from "../contexts/ErrorContext"
import { Canceler } from "axios"

export interface PostRequestData<T, V> {
  cancel: Canceler
  isLoading: boolean
  startPost: (variables: V) => Promise<T | undefined>
}

const usePostData = <T = any, V = any>(url: string): PostRequestData<T, V> => {
  const [isLoading, setIsLoading] = useState(false)
  const [cancel, setCancel] = useState<Canceler>(() => (message: string) => {})
  const { addError } = useContext(ErrorContext)

  const startPost = async (variables: V): Promise<T | undefined> => {
    setIsLoading(true)

    const { postData, cancel, getHasFailed }: APIPostRequestInteface<T> = post<
      T,
      V
    >(url, variables, addError)

    setCancel(() => cancel)

    const response = await postData()

    if (response?.data?.error?.shouldShow)
      addError(response.data.error.message, response.data.error.type)

    if (getHasFailed()) addError({ request: [`post request failed`] })

    setIsLoading(false)

    return response?.data
  }

  useEffect(() => {
    return () => {
      cancel()
      setIsLoading(false)
    }
  }, [url])

  return {
    cancel,
    isLoading,
    startPost,
  }
}

export default usePostData
