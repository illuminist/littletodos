import _ from 'lodash'
import clsx from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import * as colors from '@material-ui/core/colors'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const colorKeys = Object.keys(colors)

export interface ColorPickerDialogProps extends DialogProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  onAccept: (color: string) => void
  value: string
}

export const ColorPickerDialog: React.FC<ColorPickerDialogProps> = (props) => {
  const classes = useStyles(props)
  const { className, value, onAccept, ...restProp } = props

  const [currentColor, setColor] = React.useState(value)

  const handleAccept = React.useCallback(() => {
    onAccept(currentColor)
    restProp.onClose && restProp.onClose({}, 'escapeKeyDown')
  }, [currentColor])

  const handleSelect = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setColor(e.currentTarget.value)
      onAccept(e.currentTarget.value)
      restProp.onClose && restProp.onClose({}, 'escapeKeyDown')
    },
    [],
  )

  return (
    <Dialog className={clsx(className, classes.root)} {...restProp}>
      <DialogContent className={classes.content}>
        {colorKeys.map((c) => {
          return c === 'common' ? (
            <IconButton
              key={c}
              className={clsx(classes.colorButton, {
                [classes.selected]: currentColor === c,
              })}
              onClick={handleSelect}
              value={c}>
              <CloseIcon />
            </IconButton>
          ) : (
            <IconButton
              key={c}
              className={clsx(classes.colorButton, {
                [classes.selected]: currentColor === c,
              })}
              onClick={handleSelect}
              value={c}>
              <div
                className={classes.colorButtonContent}
                style={{
                  backgroundColor: (colors as any)[c][500],
                }}
              />
            </IconButton>
          )
        })}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => props.onClose && props.onClose(e, 'escapeKeyDown')}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ColorPickerDialog.defaultProps = {}

export default ColorPickerDialog
