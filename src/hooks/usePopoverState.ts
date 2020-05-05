import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useHistory } from 'react-router-dom'
import * as H from 'history'

type PopoverState = {
  popover: { name: string; value?: string }[]
}

const historyListeners = new Set<(location: H.Location<PopoverState>) => void>()
const mainHistoryUnsub = new Map<H.History<PopoverState>, () => void>()
const useRegisterHistoryListener = (
  callback: (location: H.Location<PopoverState>) => void,
) => {
  const history = useHistory<PopoverState>()
  React.useEffect(() => {
    if (!mainHistoryUnsub.get(history)) {
      mainHistoryUnsub.set(
        history,
        history.listen((location, action) => {
          ReactDOM.unstable_batchedUpdates(() => {
            historyListeners.forEach((fn) => fn(location))
          })
        }),
      )
    }

    historyListeners.add(callback)
    return () => {
      historyListeners.delete(callback)
      if (!historyListeners.size) {
        const off = mainHistoryUnsub.get(history)
        off && off()
        mainHistoryUnsub.delete(history)
      }
    }
  }, [callback])
}

export default (name: string) => {
  const history = useHistory<PopoverState>()

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string>()

  const listenerResponder = React.useCallback(
    (location: H.Location<PopoverState>) => {
      const popover = location.state?.popover
      if (popover && popover.length) {
        const po = popover.find((p) => p.name === name)
        setOpen(Boolean(po))
        setValue(po?.value)
      } else {
        setValue(undefined)
        setOpen(false)
      }
    },
    [],
  )

  useRegisterHistoryListener(listenerResponder)

  const handleOpen = React.useCallback(
    (value?: string | React.MouseEvent) => {
      const newLocation = {
        ...history.location,
        state: {
          ...(history.location.state || {}),
          popover: [{ name, ...(typeof value === 'string' && { value }) }],
        },
      }
      history.push(newLocation)
    },
    [name, history],
  )

  const handleStack = React.useCallback(
    (value?: string | React.MouseEvent) => {
      const newPopover = history.location.state?.popover || []
      newPopover.push({ name, ...(typeof value === 'string' && { value }) })
      const newLocation = {
        ...history.location,

        state: {
          ...(history.location.state || {}),
          popover: newPopover,
        },
      }
      history.push(newLocation)
    },
    [name, history],
  )

  const handleClose = React.useCallback(() => {
    if (history.location.state?.popover?.length) {
      history.goBack()
    } else {
      const location = history.location
      const newPopover = location.state?.popover || []
      if (newPopover.length) {
        newPopover.pop()
      } else {
      }
      const newLocation = {
        ...location,
        state: { ...location.state, popover: newPopover },
      }
      history.replace(newLocation)
    }
  }, [])

  return {
    handleOpen,
    handleClose,
    handleStack,
    open,
    value,
  }
}
