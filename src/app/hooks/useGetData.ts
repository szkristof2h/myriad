import { useEffect, useState, useContext } from "react"
import { APIRequestInteface, get } from "../utils/api"
import { ErrorContext } from "../contexts/ErrorContext"
import { Canceler } from "axios"

export interface GetData<T> {
  cancel: Canceler | undefined
  data: T | undefined
  isLoading: boolean
  refresh: () => void
}

const useGetData = <T = any>(url: string): GetData<T> => {
  const [data, setData] = useState<T | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [cancel, setCancel] = useState<Canceler>()
  const [shouldRefresh, setShouldRefresh] = useState(false)
  const { addError } = useContext(ErrorContext)

  useEffect(() => {
    setIsLoading(true)
    const { getData, cancel, getHasFailed }: APIRequestInteface<T> = get<T>(url) // TODO: error handling

    setCancel(() => cancel)
    ;(async () => {
      const response = await getData()

      setData(response?.data)
      // TODO: response.error
      if (getHasFailed()) addError({ user: [`get user request failed`] })

      setIsLoading(false)
    })()
    return () => {
      cancel()
      setIsLoading(false)
    }
  }, [shouldRefresh, url])

  return {
    cancel,
    data,
    isLoading,
    refresh: () => setShouldRefresh(true),
  }
}

export default useGetData
