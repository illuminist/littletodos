import * as React from 'react'
import get from 'lodash/get'
import setWith from 'lodash/setWith'

const useRefMap = function <T>() {
  const ref = React.useRef<{ [id: string]: { current: T } }>()
  return React.useCallback((id: string) => {
    if (!get(ref, ['current', id])) {
      setWith(ref, ['current', id], { current: null }, Object)
    }
    return get(ref, ['current', id]) as { current: T }
  }, [])
}

export type RefMap<T> = (id: string) => { current: T }

export default useRefMap
