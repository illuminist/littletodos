import React from 'react'

export const useSubmitHandler = <T = React.FormEvent | React.MouseEvent>(
  fn: (e: T, ...args: any[]) => Promise<void>,
  deps: any[],
): {
  isWorking: boolean
  error: Error | null
  clearError: () => void
  handleSubmit: (e: T) => Promise<void>
  setWorking: (stat: boolean) => void
} => {
  const [isWorking, setWorking] = React.useState(false)
  const [error, setError] = React.useState(null)

  const clearError = React.useCallback((): void => setError(null), [setError])
  const handleSubmit = React.useCallback(
    async (e: T, ...args: any[]): Promise<void> => {
      if (isWorking) return
      setWorking(true)
      try {
        await fn(e, ...args)
      } catch (e) {
        setError(e)
        setWorking(false)
      }
    },
    [isWorking, setError, setWorking, ...deps],
  )

  return { handleSubmit, isWorking, error, clearError, setWorking }
}

export default useSubmitHandler
