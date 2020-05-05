import clsx from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import AddButton from 'components/AddButton'
import useTodoCards from 'connectors/useTodoCards'
import useUserTodoOrder from 'connectors/useUserTodoOrder'
import TodoCard from 'components/TodoCard'
import {
  DragDropContext,
  DropResult,
  Droppable,
  DragStart,
} from 'react-beautiful-dnd'
import Container from '@material-ui/core/Container'
import {
  rearrangeThunk,
  rearrangeCardThunk,
  deleteTodoThunk,
} from 'store/optimistic'
import { dragStart, dragEnd } from 'store/dragextend'
import { useDispatch, useSelector } from 'react-redux'
import useRefMap from 'hooks/useRefMap'
import { TodoList } from 'types/data'

export interface TodoBoardProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
}

export const TodoBoard: React.FC<TodoBoardProps> = (props) => {
  const classes = useStyles(props)
  const { className } = props

  const userTodos = useUserTodoOrder().useData()
  const connector = useTodoCards()
  const dispatch = useDispatch()
  const optimisticOrdered = useSelector((state) => state.optimistic.cardOrder)
  const data = connector.useData()

  const refMap = useRefMap<HTMLDivElement>()
  const cardControlMap = useRefMap<{
    focus: () => void
    data: () => TodoList | null | undefined
  }>()

  const handleRearrage = (dropResult: DropResult) => {
    dispatch(dragEnd(dropResult))
    if (dropResult.destination?.droppableId.startsWith('DELETE-')) {
      dispatch(
        deleteTodoThunk(
          dropResult,
          cardControlMap(dropResult.source.droppableId).current?.data()!,
        ),
      )
      return
    }
    if (dropResult.destination) {
      if (
        dropResult.destination.droppableId === 'board' &&
        userTodos?.ordered
      ) {
        dispatch(rearrangeCardThunk(dropResult, userTodos?.ordered))
      } else {
        dispatch(
          rearrangeThunk(
            dropResult,
            cardControlMap(dropResult.source.droppableId).current?.data()!,
            cardControlMap(dropResult.destination.droppableId).current?.data()!,
          ),
        )
      }
    }
  }

  const handleDragStart = React.useCallback((e: DragStart) => {
    dispatch(dragStart(e))
  }, [])

  const finalOrdered = optimisticOrdered || userTodos?.ordered

  const handleAdded = React.useCallback((id: string) => {
    setTimeout(() => {
      const cardEl = refMap(id).current
      const cardControl = cardControlMap(id).current
      if (cardEl && cardControl) {
        cardEl.scrollIntoView()
        cardControl.focus()
      }
    }, 100)
  }, [])

  return (
    <Container maxWidth="sm" className={classes.container}>
      <DragDropContext onDragEnd={handleRearrage} onDragStart={handleDragStart}>
        <Droppable droppableId="board" type="CARD">
          {(boardDropProvided) => (
            <div
              {...boardDropProvided.droppableProps}
              ref={boardDropProvided.innerRef}
              className={clsx(className, classes.root)}>
              {finalOrdered?.map((id, index) => (
                <TodoCard
                  ref={refMap(id)}
                  className={classes.card}
                  key={id}
                  id={id}
                  index={index}
                  controlRef={cardControlMap(id)}
                />
              ))}
              {boardDropProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <AddButton className={classes.addFab} onAdd={handleAdded} />
    </Container>
  )
}

TodoBoard.defaultProps = {}

export default TodoBoard
