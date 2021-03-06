import { useEffect, useState, useContext } from "react"
import { APIRequestInteface, get } from "../requests/api"
import { ErrorContext } from "../contexts/ErrorContext"
import { Canceler } from "axios"

export interface GetData<T> {
  cancel: Canceler
  data: T | undefined
  isLoading: boolean
  refetch: () => void
}

const useGetData = <T = any, V = any>(url: string, params?: V): GetData<T> => {
  const [data, setData] = useState<T | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [cancel, setCancel] = useState<Canceler>(() => (message: string) => {})
  const [shouldRefetch, setShouldRefetch] = useState(false)
  const [previousUrl, setPreviousUrl] = useState("")
  const { addError } = useContext(ErrorContext)

  useEffect(() => {
    let didCancel = false

    if (url && (previousUrl !== url || shouldRefetch)) {
      setIsLoading(true)

      const { getData, cancel, getHasFailed }: APIRequestInteface<T> = get<
        T,
        V
      >(url, addError, params)

      setCancel(() => cancel)
      ;(async () => {
        const response = await getData()

        if (response?.data?.error?.shouldShow)
          addError(response.data.error.message, response.data.error.type)
        if (getHasFailed()) addError(`get request failed`, "request")

        if (!didCancel) {
          setData(response?.data)
          setIsLoading(false)
          setShouldRefetch(false)
        }
      })()
    }

    if (!didCancel) setPreviousUrl(url)

    return () => {
      didCancel = true
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

export default useGetData
