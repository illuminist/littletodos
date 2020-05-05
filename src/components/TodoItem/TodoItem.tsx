import _ from 'lodash'
import clsx from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import firebase from 'firebase/app'
import { Draggable, DraggableStateSnapshot } from 'react-beautiful-dnd'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import DeleteIcon from '@material-ui/icons/Delete'
import { useSelector, useDispatch } from 'react-redux'
import useTodo from 'connectors/useTodo'
import { useThrottleUpdateField } from 'hooks/useThrottleUpdateField'
import useTheme from '@material-ui/core/styles/useTheme'
import { Theme } from '@material-ui/core'

export interface TodoItemProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  todoId: string
  listId: string
  index: number
}

const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
  const firestore = firebase.firestore()
  const { listid, todoid } = e.target.dataset
  if (listid && todoid) {
    const ref = firestore.collection('todos').doc(listid)
    ref.update({
      ['todoData.' + todoid + '.checked']: e.target.checked,
    })
  }
}

const handleTextUpdate = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  const firestore = firebase.firestore()
  const { listid, todoid } = e.target.dataset
  if (listid && todoid) {
    const ref = firestore.collection('todos').doc(listid)
    ref.update({
      ['todoData.' + todoid + '.text']: e.target.value,
    })
  }
}

const getDropStyle = (
  style: any,
  snapshot: DraggableStateSnapshot,
  theme: Theme,
) => {
  if (
    !snapshot.isDropAnimating ||
    !snapshot.draggingOver?.startsWith('DELETE-')
  ) {
    return style
  }
  const { moveTo, curve, duration } = snapshot.dropAnimation!
  // move to the right spot
  const translate = `translate(${moveTo.x}px, ${moveTo.y}px)`
  // add a bit of turn for fun
  const scale = 'scale(0)'

  // patching the existing style
  return {
    ...style,
    transform: `${translate} ${scale}`,
    // slowing down the drop because we can
    transition: theme.transitions.create('all'),
  }
}

export const TodoItem: React.FC<TodoItemProps> = (props) => {
  const classes = useStyles(props)
  const { className, todoId, listId, index } = props

  const optimisticData = useSelector((state) =>
    _.get(state, ['optimistic', 'list', listId, 'todoData', todoId]),
  )
  const listData = useTodo(listId).useData()
  const itemData = optimisticData || listData?.todoData[todoId]

  const theme = useTheme()

  const { isWorking, ...inputProps } = useThrottleUpdateField<
    HTMLTextAreaElement | HTMLInputElement
  >({
    value: itemData?.text,
    handleUpdate: handleTextUpdate,
  })

  return listData && itemData ? (
    <Draggable key={todoId} draggableId={todoId} index={index}>
      {(dragProvided, snap) => (
        <ListItem
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          className={clsx(classes.root, {
            [classes.dragging]: snap.isDragging,
          })}
          style={getDropStyle(dragProvided.draggableProps.style, snap, theme)}>
          <ListItemIcon>
            {snap.draggingOver?.startsWith('DELETE-') ? (
              <DeleteIcon color="error" />
            ) : (
              <Checkbox
                // edge="start"
                checked={itemData.checked}
                color="primary"
                inputProps={
                  {
                    'data-listid': listId,
                    'data-todoid': todoId,
                  } as any
                }
                onChange={handleCheck}
                // inputProps={{ 'aria-labelledby': labelId }}
              />
            )}
          </ListItemIcon>

          <TextField
            placeholder={'What needs to be done'}
            multiline
            fullWidth
            variant="standard"
            inputProps={
              {
                'data-listid': listId,
                'data-todoid': todoId,
              } as any
            }
            {...inputProps}
          />
          <ListItemIcon
            className={classes.dragIcon}
            {...dragProvided.dragHandleProps}>
            <DragIndicatorIcon />
          </ListItemIcon>
        </ListItem>
      )}
    </Draggable>
  ) : null
}

TodoItem.defaultProps = {}

export default React.memo(TodoItem)
