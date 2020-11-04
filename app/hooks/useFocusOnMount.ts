import { MutableRefObject, useEffect } from 'react'

function useFocusOnMount(inputRef: MutableRefObject<HTMLInputElement | null>, delay = 0) {
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, delay)
  }, [inputRef, delay])
}

export default useFocusOnMount
