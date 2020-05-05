import _ from 'lodash'
import clsx from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import * as colors from '@material-ui/core/colors'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ColorPickerDialog from './ColorPickerDialog'

export interface ColorMemuProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  label?: string
  value: string
  onChange: (color: string) => void
}

export const ColorMenu = React.forwardRef<any, ColorMemuProps>((props, ref) => {
  const classes = useStyles(props)
  const { className, label, value, onChange } = props

  const [menuOpen, setMenuOpen] = React.useState(false)

  const handleAcceptColor = (color: string) => {
    onChange(color)
  }

  const openDialog = React.useCallback(() => setMenuOpen(true), [])
  const closeDialog = React.useCallback(() => setMenuOpen(false), [])
  return (
    <>
      <ListItem
        ref={ref}
        button
        className={clsx(className, classes.root)}
        onClick={openDialog}>
        <ListItemAvatar>
          <div
            className={classes.colorIcon}
            style={{
              backgroundColor: (colors as any)[value]
                ? (colors as any)[value][500]
                : '#fff',
            }}
          />
        </ListItemAvatar>
        <ListItemText>{label}</ListItemText>
      </ListItem>
      <ColorPickerDialog
        onClose={closeDialog}
        value={value}
        open={menuOpen}
        onAccept={handleAcceptColor}
      />
    </>
  )
})

ColorMenu.defaultProps = {}

export default ColorMenu
