import { useEffect, useState, useContext } from "react"
import { post, APIPostRequestInteface } from "../requests/api"
import { ErrorContext } from "../contexts/ErrorContext"
import { Canceler } from "axios"

export interface PostData<T> {
  cancel: Canceler
  data: T | undefined
  isLoading: boolean
  refetch: () => void
}

const usePostData = <T = any, V = any>(
  url: string,
  variables: V
): PostData<T> => {
  const [data, setData] = useState<T | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [cancel, setCancel] = useState<Canceler>(() => (message: string) => {})
  const [shouldRefetch, setShouldRefetch] = useState(false)
  const { addError } = useContext(ErrorContext)

  useEffect(() => {
    setIsLoading(true)

    const { postData, cancel, getHasFailed }: APIPostRequestInteface<T> = post<
      T,
      V
    >(url, variables, addError)

    setCancel(() => cancel)
    ;(async () => {
      const response = await postData()

      setData(response?.data)
      if (response?.data?.error)
        addError({ user: [response.data.error.message] })

      if (getHasFailed()) addError({ request: [`post request failed`] })

      setIsLoading(false)
    })()

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
  }
}

export default usePostData
