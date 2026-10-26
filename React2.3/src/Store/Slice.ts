import { configureStore } from '@reduxjs/toolkit'
import userReducer from './RTX'

export const store = configureStore({
  reducer: {
    users: userReducer
  }
})