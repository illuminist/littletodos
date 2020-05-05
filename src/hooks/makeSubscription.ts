import * as React from 'react'
import * as ReactDOM from 'react-dom'

export const makeSubscription = <T>(defaultValue: T) => {
  const callbackSet = new Set<(v: T) => void>()
  const forceUpdaterSet = new Set<(v: any) => void>()
  const valueRef: { current: T } = {
    current: defaultValue,
  }
  const defaultSetter = () => valueRef.current
  const caller = (fn: (a: any) => void) => fn(0)

  const triggerUpdate = (v: T | ((v: T) => T)) => {
    if (typeof v === 'function') {
      valueRef.current = (v as (v: T) => T)(valueRef.current)
    } else valueRef.current = v
    ReactDOM.unstable_batchedUpdates(() => {
      callbackSet.forEach(fn => fn(defaultSetter as any))
    })
  }
  const forceReducer = (s: boolean) => !s

  return {
    useSubsciption: () => {
      const [value, setValue] = React.useState<T>(defaultSetter)
      const [, forceUpdate] = React.useReducer(forceReducer, false)
      React.useEffect(() => {
        callbackSet.add(setValue)
        forceUpdaterSet.add(forceUpdate)
        return () => {
          callbackSet.delete(setValue)
          forceUpdaterSet.add(forceUpdate)
        }
      }, [])
      return value
    },
    useProvider: (v: T) => {
      React.useEffect(() => {
        triggerUpdate(v)
        return () => {
          triggerUpdate(defaultValue)
        }
      }, [v])
    },
    setValue: triggerUpdate,
    setValueHard: (v: T) => {
      triggerUpdate(v)
      forceUpdaterSet.forEach(caller)
    },
    getValue: () => valueRef.current,
  }
}

export default makeSubscription
