import _ from 'lodash'
import clsx from 'clsx'
import * as React from 'react'
import useStyles, { useErrorCardStyles } from './styles'
import * as colors from '@material-ui/core/colors'
import Card from '@material-ui/core/Card'
import Grow from '@material-ui/core/Grow'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import ErrorIcon from '@material-ui/icons/Error'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import useTodo from 'connectors/useTodo'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import TodoItem from 'components/TodoItem'
import { useSelector } from 'react-redux'
import { useThrottleUpdateField } from 'hooks/useThrottleUpdateField'
import usePopoverState from 'hooks/usePopoverState'
import CardMenu from 'components/CardMenu'
import { MuiThemeProvider, useTheme } from '@material-ui/core/styles'
import produce from 'immer'
import ErrorBoundary from 'components/ErrorBoundary'
import { CardContent } from '@material-ui/core'
import { updateCard, deleteCard, editTodo } from 'firebase-actions/todos'
import { TodoList } from 'types/data'

export interface TodoCardProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  id: string
  index: number
  controlRef?: React.RefObject<{
    focus: () => void
    data: () => TodoList | null | undefined
  }>
}

const handleTitleUpdate = async (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  const { listid } = e.target.dataset
  if (listid) {
    await updateCard(listid, { title: e.target.value })
  }
}

export const TodoCard = React.forwardRef<HTMLDivElement, TodoCardProps>(
  (props, ref) => {
    const { className, id, index, controlRef } = props

    const data = useTodo(id).useData()
    const classes = useStyles({ data: data || null })
    const optimisticData = useSelector((state) => state.optimistic.list[id])
    const handleAdd = () => {
      editTodo(id, '', '')
    }

    const [editingTitle, setTitleEdit] = React.useState(false)
    const handleStartTitleEdit = React.useCallback(() => {
      setTitleEdit(true)
    }, [])
    const { ...titleProps } = useThrottleUpdateField<
      HTMLInputElement | HTMLTextAreaElement
    >({
      value: data?.title || '',
      handleUpdate: async (e) => {
        await handleTitleUpdate(e)
      },
      onDone: () => setTitleEdit(false),
    })

    React.useImperativeHandle(
      controlRef,
      () => ({
        focus: () => {
          setTitleEdit(true)
        },
        data: () => data,
      }),
      [data],
    )

    const { handleOpen: handleMenuOpen } = usePopoverState('cardmenu' + id)

    const cardMemuAnchorRef = React.useRef<HTMLElement>(null)

    const draggingType = useSelector((state) => state.drag.type)
    const draggingSource = useSelector((state) => state.drag.source)

    const textFilter = useSelector((state) =>
      state.filter.textSearch.toLowerCase(),
    )
    if (data === undefined) {
      return (
        <Card className={clsx(className, classes.root)}>
          <div className={classes.head}>
            <Skeleton width={160} height={32} />
          </div>
          <List>
            <ListItem>
              <ListItemIcon>
                <Skeleton width={32} height={32} />
              </ListItemIcon>
              <ListItemText>
                <Skeleton width={160} height={32} />
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Skeleton width={32} height={32} />
              </ListItemIcon>
              <ListItemText>
                <Skeleton width={250} height={32} />
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Skeleton width={32} height={32} />
              </ListItemIcon>
              <ListItemText>
                <Skeleton width={200} height={32} />
              </ListItemText>
            </ListItem>
          </List>
        </Card>
      )
    }

    if (data === null) {
      throw new Error('data-not-exist')
    }

    if (textFilter) {
      if (
        (!data.title || data.title.toLowerCase().indexOf(textFilter) < 0) &&
        _.every(
          data.todoData,
          (data) => data.text.toLowerCase().indexOf(textFilter) < 0,
        )
      )
        return null
    }

    return (
      <Draggable index={index} draggableId={id}>
        {(cardDragProvided, cardSnapshot) => (
          <Droppable droppableId={id} type="LISTITEM">
            {(dropProvided) => (
              <Card
                id={id}
                elevation={cardSnapshot.isDragging ? 22 : 5}
                {...cardDragProvided.draggableProps}
                style={{
                  ...cardDragProvided.draggableProps.style,
                  zIndex: 500,
                }}
                className={clsx(className, classes.root)}
                ref={(el: HTMLDivElement) => {
                  cardDragProvided.innerRef(el)
                  ref && ('current' in ref ? (ref.current = el) : ref(el))
                }}>
                <div
                  className={classes.head}
                  {...cardDragProvided.dragHandleProps}>
                  {editingTitle ? (
                    <TextField
                      autoFocus
                      fullWidth
                      className={classes.titleEditorRoot}
                      placeholder="untitled"
                      InputProps={{
                        className: classes.titleEditorInput,
                        classes: { underline: classes.titleEditorUnderline },
                      }}
                      inputProps={
                        {
                          'data-listid': id,
                        } as any
                      }
                      {...titleProps}
                    />
                  ) : (
                    <Typography
                      className={clsx(classes.headTitle, {
                        [classes.untitledTitle]: !data?.title,
                      })}
                      variant="h5">
                      {data?.title || 'untitled'}
                      <IconButton
                        color="inherit"
                        onClick={handleStartTitleEdit}>
                        <EditIcon />
                      </IconButton>
                    </Typography>
                  )}
                  <IconButton
                    color="inherit"
                    onClick={handleMenuOpen}
                    buttonRef={cardMemuAnchorRef}>
                    <MoreHorizIcon />
                  </IconButton>
                  <CardMenu listId={id} anchorEl={cardMemuAnchorRef.current} />
                </div>

                <div className={classes.cardContent}>
                  <List
                    ref={dropProvided.innerRef}
                    {...dropProvided.droppableProps}>
                    {data?.todoIds &&
                      (
                        optimisticData?.todoIds || data.todoIds
                      ).map((todoId, index) => (
                        <TodoItem
                          key={todoId}
                          listId={id}
                          todoId={todoId}
                          index={index}
                        />
                      ))}
                    {dropProvided.placeholder}
                  </List>

                  <Droppable
                    droppableId={'DELETE-' + index}
                    type="LISTITEM"
                    isDropDisabled={
                      draggingType !== 'LISTITEM' ||
                      draggingSource?.droppableId !== id
                    }>
                    {(deleterProvided) => (
                      <List>
                        <Grow
                          in={
                            draggingType === 'LISTITEM' &&
                            draggingSource?.droppableId === id
                          }>
                          <ListItem
                            {...deleterProvided.droppableProps}
                            ref={deleterProvided.innerRef}
                            className={classes.deleteZone}>
                            <ListItemIcon className={classes.addIcon}>
                              <DeleteIcon />
                            </ListItemIcon>
                            <ListItemText>Drag here to delete</ListItemText>
                          </ListItem>
                        </Grow>
                        <Grow
                          in={
                            draggingType !== 'LISTITEM' ||
                            draggingSource?.droppableId !== id
                          }>
                          <ListItem button onClick={handleAdd}>
                            <ListItemIcon className={classes.addIcon}>
                              <AddIcon />
                            </ListItemIcon>

                            <ListItemText>Add</ListItemText>
                          </ListItem>
                        </Grow>
                      </List>
                    )}
                  </Droppable>
                </div>
              </Card>
            )}
          </Droppable>
        )}
      </Draggable>
    )
  },
)

TodoCard.defaultProps = {}

const withCardTheme = (Component: typeof TodoCard) =>
  React.forwardRef<HTMLDivElement, TodoCardProps>((props, ref) => {
    const listener = useTodo(props.id)
    const data = listener.useData()
    const theme = useTheme()
    const newTheme = React.useMemo(() => {
      return produce(theme, (theme) => {
        if (data?.colorPrimary && (colors as any)[data.colorPrimary]) {
          theme.palette.primary = theme.palette.augmentColor(
            (colors as any)[data.colorPrimary],
          )
        }
        if (data?.colorSecondary && (colors as any)[data.colorSecondary]) {
          theme.palette.secondary = theme.palette.augmentColor(
            (colors as any)[data.colorSecondary],
          )
        }
      })
    }, [theme, data?.colorPrimary, data?.colorSecondary])
    return (
      <MuiThemeProvider theme={newTheme}>
        <Component {...props} ref={ref} />
      </MuiThemeProvider>
    )
  })

const ErrorCard: React.FC<{ id: string; className?: string }> = React.memo(
  ({ id, className }) => {
    const classes = useErrorCardStyles({})
    return (
      <Card className={clsx(classes.root, className)}>
        <CardContent className={classes.content}>
          <ErrorIcon className={classes.icon} />
          <Typography variant="h4">Error</Typography>
          <Typography>Something is wrong with this card</Typography>
          <Button variant="outlined" onClick={() => deleteCard(id)}>
            Delete this card
          </Button>
        </CardContent>
      </Card>
    )
  },
)

const withErrorBoundary = (Component: typeof TodoCard) =>
  React.forwardRef<HTMLDivElement, TodoCardProps>((props, ref) => {
    return (
      <ErrorBoundary
        fallback={<ErrorCard className={props.className} id={props.id} />}>
        <Component {...props} ref={ref} />
      </ErrorBoundary>
    )
  })

export default withErrorBoundary(withCardTheme(TodoCard))
