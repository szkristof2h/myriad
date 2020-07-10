import { useEffect, useState, useContext } from "react"
import { post, APIPostRequestInteface } from "../requests/api"
import { ErrorContext } from "../contexts/ErrorContext"
import { Canceler } from "axios"

export interface PostData<T, V> {
  cancel: Canceler
  data: T | undefined
  isLoading: boolean
  refetch: () => void
  startPost: (variables: V) => Promise<void>
}

const usePostData = <T = any, V = any>(url: string): PostData<T, V> => {
  const [data, setData] = useState<T>()
  const [isLoading, setIsLoading] = useState(false)
  const [cancel, setCancel] = useState<Canceler>(() => (message: string) => {})
  const [shouldRefetch, setShouldRefetch] = useState(false)
  const { addError } = useContext(ErrorContext)

  const startPost = async (variables: V) => {
    setIsLoading(true)

    const { postData, cancel, getHasFailed }: APIPostRequestInteface<T> = post<
      T,
      V
    >(url, variables, addError)

    setCancel(() => cancel)

    const response = await postData()

    setData(response?.data)

    if (response?.data?.error?.shouldShow)
      addError(response.data.error.message, response.data.error.type)

    if (getHasFailed()) addError({ request: [`post request failed`] })

    setIsLoading(false)
  }

  useEffect(() => {
    return () => {
      cancel()
      setIsLoading(false)
    }
  }, [shouldRefetch, url])

  return {
    cancel,
    data,
    isLoading,
    refetch: () => setShouldRefetch(true),
    startPost,
  }
}

export default usePostData
