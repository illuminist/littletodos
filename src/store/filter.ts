import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  textSearch: '',
}

export const filter = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<{
        field: keyof typeof initialState
        value: string
      }>,
    ) => {
      state[action.payload.field] = action.payload.value
    },
    clearFilter: () => initialState,
  },
})

export default filter
