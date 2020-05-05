import * as React from 'react'
import set from 'lodash/set'
import firebase from 'firebase/app'
import { Todo, TodoList } from 'types/data'
import { createSlice, createAction } from '@reduxjs/toolkit'
import { DropResult } from 'react-beautiful-dnd'
import { AppThunk } from 'store'
import {
  rearrangeCard as rearrangeCardUpdate,
  rearrangeTodo as rearrangeTodoUpdate,
  deleteTodo as deleteTodoUpdate,
} from 'firebase-actions/todos'
import { sleep } from 'utils/helpers'

const rearrangeCard = createAction<string[]>('rearrangeCard')
const rearrangeCardClear = createAction('rearrangeCardClear')
export const rearrangeCardThunk = (
  dropResult: DropResult,
  idList: string[],
): AppThunk => async (dispatch, getState) => {
  const newIdList = [...idList]
  newIdList.splice(dropResult.source.index, 1)
  newIdList.splice(dropResult.destination!.index, 0, dropResult.draggableId)
  dispatch(rearrangeCard(newIdList))
  await rearrangeCardUpdate({
    listId: dropResult.draggableId,
    sourceIndex: dropResult.source.index,
    targetIndex: dropResult.destination!.index,
  })
  await sleep(100)
  dispatch(clearOptimistic())
}

const rearrangeList = createAction<{ [id: string]: TodoList }>('rearrangeList')
const rearrangeListClear = createAction<string[]>('rearrangeListClear')
export const rearrangeThunk = (
  dropResult: DropResult,
  sourceList: TodoList,
  targetList: TodoList,
): AppThunk => async (dispatch, getState) => {
  const todoId = dropResult.draggableId
  const sourceId = dropResult.source.droppableId
  const sourceIndex = dropResult.source.index
  const targetId = dropResult.destination?.droppableId
  const targetIndex = dropResult.destination?.index

  if (dropResult.destination && targetId && typeof targetIndex === 'number') {
    const newSourceList = [...sourceList.todoIds]
    const newTargetList =
      sourceList === targetList ? newSourceList : [...targetList.todoIds]

    newSourceList.splice(sourceIndex, 1)
    newTargetList.splice(targetIndex, 0, todoId)
    dispatch(
      rearrangeList({
        [sourceId]: {
          ...sourceList,
          todoIds: newSourceList,
        },
        [targetId]: {
          ...targetList,
          todoIds: newTargetList,
          todoData: {
            ...targetList.todoData,
            [todoId]: sourceList.todoData[todoId],
          },
        },
      }),
    )
    await rearrangeTodoUpdate({
      todoId: dropResult.draggableId,
      sourceId: dropResult.source.droppableId,
      sourceIndex: dropResult.source.index,
      targetId: dropResult.destination.droppableId,
      targetIndex: dropResult.destination.index,
    })
    await sleep(100)
    dispatch(clearOptimistic())
  }
}

export const deleteTodo = createAction<{
  todoId: string
  cardId: string
  cardData: TodoList
}>('deleteTodo')
export const deleteTodoThunk = (
  dropResult: DropResult,
  cardData: TodoList,
): AppThunk => async (dispatch) => {
  dispatch(
    deleteTodo({
      cardId: dropResult.source.droppableId,
      todoId: dropResult.draggableId,
      cardData,
    }),
  )
  await deleteTodoUpdate(dropResult.source.droppableId, dropResult.draggableId)
  await sleep(100)
  dispatch(clearOptimistic())
}

export const clearOptimistic = createAction('clearOptimistic')

export type OptimisticContext = {
  list: {
    [listid: string]: {
      todoData: { [todoid: string]: Todo }
      todoIds: string[]
    }
  }
  cardOrder: string[] | null
  focusing: string | null
  focusingList: string | null
  lastEditTime: number | null
}

const initialState: OptimisticContext = {
  list: {},
  cardOrder: null,
  focusing: null,
  focusingList: null,
  lastEditTime: null,
}

export const optimistic = createSlice({
  initialState,
  name: 'optimistic',
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(rearrangeList, (state, action) => {
        Object.keys(action.payload).forEach((k) => {
          set(state, ['list', k], action.payload[k])
        })
      })
      .addCase(rearrangeListClear, (state, action) => {
        action.payload.forEach((k) => {
          delete state.list[k].todoIds
        })
        state.list = {}
      })
      .addCase(rearrangeCard, (state, action) => {
        state.cardOrder = action.payload
      })
      .addCase(rearrangeCardClear, (state, action) => {
        state.cardOrder = null
        state.list = {}
      })
      .addCase(deleteTodo, (state, action) => {
        state.list[action.payload.cardId] = action.payload.cardData
        const todoIds = [...action.payload.cardData.todoIds]
        state.list[action.payload.cardId].todoIds = todoIds
        todoIds.splice(todoIds.indexOf(action.payload.todoId), 1)
      })
      .addCase(clearOptimistic, () => initialState),
})

export const OptimisticContext = React.createContext({})
export default optimistic
