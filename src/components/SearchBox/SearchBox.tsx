import _ from 'lodash'
import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import IconButton from '@material-ui/core/IconButton'
import Hidden from '@material-ui/core/Hidden'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'
import { Theme } from '@material-ui/core/styles'

export type ISearchBoxProps = TextFieldProps & {
  onClear?: () => void
  onOpen?: () => void
  size?: 'full' | 'mini'
}

export const SearchBox: React.FC<ISearchBoxProps> = props => {
  const classes = useStyles(props)
  const matches = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'))
  const {
    value,
    size = matches ? 'mini' : 'full',
    onClear,
    onFocus,
    onBlur,
    onOpen,
  } = props
  const [openState, setOpen] = React.useState(false)
  const open = !!value || openState
  const handleOpen = React.useCallback(() => {
    setOpen(true)
    setImmediate(() => ref.current?.focus())
    onOpen && onOpen()
  }, [])
  const handleBlur = React.useCallback(
    e => {
      setOpen(false)
      onBlur && onBlur(e)
    },
    [onBlur, setOpen],
  )
  const handleFocus = React.useCallback(
    e => {
      onFocus && onFocus(e)
    },
    [onFocus, setOpen],
  )
  const ref = React.useRef<HTMLInputElement>(null)
  return (
    <>
      {(size === 'full' || open) && (
        <TextField
          {...props}
          inputRef={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          InputProps={{
            ...props.InputProps,
            endAdornment: (
              <InputAdornment position="end">
                {value && onClear ? (
                  <IconButton onClick={onClear} color="inherit">
                    <CloseIcon />
                  </IconButton>
                ) : (
                  <SearchIcon color="inherit" />
                )}
              </InputAdornment>
            ),
          }}
        />
      )}
      {size === 'mini' && !open && (
        <IconButton color="inherit" onClick={handleOpen}>
          <SearchIcon />
        </IconButton>
      )}
    </>
  )
}

SearchBox.defaultProps = {}

export default SearchBox
