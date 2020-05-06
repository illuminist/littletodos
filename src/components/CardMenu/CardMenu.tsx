import _ from 'lodash'
import clsx from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import useTodo from 'connectors/useTodo'
import ColorMenu from './ColorMenu'
import usePopoverState from 'hooks/usePopoverState'
import { updateCard, deleteCard } from 'firebase-actions/todos'

export interface CardMenuProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  listId: string
  anchorEl?: Element | null
}

export const CardMenu: React.FC<CardMenuProps> = (props) => {
  const classes = useStyles(props)
  const { className, anchorEl, listId } = props

  const todoListener = useTodo(listId)
  const todoData = todoListener.useData()

  const { open, handleClose } = usePopoverState('cardmenu' + listId)

  return todoData ? (
    <Menu
      className={clsx(className, classes.root)}
      open={open}
      onClose={handleClose}
      anchorEl={anchorEl}>
      <ColorMenu
        label="Primary color"
        value={todoData?.colorPrimary}
        onChange={(color) => {
          handleClose()
          updateCard(listId, { colorPrimary: color === 'common' ? '' : color })
        }}
      />
      <MenuItem
        onClick={() => {
          handleClose()
          deleteCard(listId)
        }}>
        <ListItemIcon>
          <DeleteForeverIcon color="error" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  ) : null
}

CardMenu.defaultProps = {}

export default CardMenu
