import { useRef } from 'react'

export const useDebounce = (delay: number) => {
  const timeoutRef = useRef<number>()

  const debouncedFn = (fn: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      fn()
    }, delay)
  }

  return debouncedFn
}
