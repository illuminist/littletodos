import * as React from 'react'

type EventType<EL extends { value: string }> =
  // | React.ChangeEvent<EL>
  React.FocusEvent<EL>

export type Options<EL extends { value: string }> = {
  value: string
  handleUpdate: (e: EventType<EL>) => void | Promise<void>
  onDone?: () => void
  interval?: number
}

export const useThrottleUpdateField = <EL extends { value: string }>(
  options: Options<EL>,
) => {
  const valueRef = React.useRef(options.value)
  valueRef.current = options.value
  const optionsRef = React.useRef(options)
  optionsRef.current = {
    value: options.value,
    handleUpdate: options.handleUpdate,
    onDone: options.onDone,
    interval: options.interval ?? 1000,
  }
  const [isFocusing, setFocus] = React.useState(false)
  const [currentValue, setCurrentValue] = React.useState(options.value)
  const [isWorking, setWorking] = React.useState(false)

  const timerRef = React.useRef<number>()
  const eRef = React.useRef<EventType<EL>>()

  const updateCall = React.useCallback(async (e: EventType<EL>) => {
    e.persist()
    eRef.current = e
    setCurrentValue(e.target.value)
    if (!timerRef.current)
      timerRef.current = setTimeout(async () => {
        setWorking(true)
        eRef.current && (await optionsRef.current.handleUpdate(eRef.current))
        setWorking(false)
        timerRef.current = undefined
      }, optionsRef.current.interval)
  }, [])

  const handleFocus = React.useCallback(() => {
    setFocus(true)
    setCurrentValue(valueRef.current)
  }, [])

  const handleBlur = React.useCallback(async (e: EventType<EL>) => {
    timerRef.current && clearTimeout(timerRef.current)
    timerRef.current = undefined
    setWorking(true)
    await optionsRef.current.handleUpdate(e)
    setWorking(false)
    setTimeout(() => {
      setFocus(false)
      optionsRef.current.onDone && optionsRef.current.onDone()
    }, 100)
  }, [])

  return {
    onBlur: handleBlur,
    onFocus: handleFocus,
    onChange: updateCall,
    value: isFocusing ? currentValue : options.value,
    isWorking,
  }
}
