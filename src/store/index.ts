import { configureStore } from '@reduxjs/toolkit';
import directoriesReducer from './slices/directoriesSlice';
import noticesReducer from './slices/noticesSlice';
import searchReducer from './slices/searchSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    directories: directoriesReducer,
    notices: noticesReducer,
    search: searchReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;