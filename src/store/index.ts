import {
  configureStore,
  combineReducers,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit'
import { persistStore, persistReducer, PersistConfig } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import settings from './settings'
import optimistic from './optimistic'
import filter from './filter'
import { reducer as dragReducer } from './dragextend'

export type StoreState = ReturnType<typeof store.getState>

declare module 'react-redux' {
  interface DefaultRootState extends StoreState {}
}

export const store = configureStore({
  reducer: persistReducer(
    {
      key: 'app',
      storage,
      blacklist: ['optimistic', 'drag', 'filter'],
    },
    combineReducers({
      optimistic: optimistic.reducer,
      settings: settings.reducer,
      drag: dragReducer,
      filter: filter.reducer,
    }),
  ),
})

export type AppThunk = ThunkAction<void, StoreState, unknown, Action<any>>

export const persistor = persistStore(store)
export default store
