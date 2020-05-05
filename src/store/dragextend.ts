import { DragStart, DropResult, DraggableLocation } from 'react-beautiful-dnd'
import { createAction, createReducer } from '@reduxjs/toolkit'

export const dragStart = createAction<DragStart>('dragStart')
export const dragEnd = createAction<DropResult>('dragEnd')

const initialState: {
  type?: string
  source?: DraggableLocation
} = {}

export const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(dragStart, (state, action) => {
      state.type = action.payload.type
      state.source = action.payload.source
    })
    .addCase(dragEnd, () => {
      return initialState
    }),
)
