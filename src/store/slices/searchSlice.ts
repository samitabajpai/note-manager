import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchState, Notice } from '../../types';

const initialState: SearchState = {
  query: '',
  mode: 'simple',
  isOpen: false,
  suggestions: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setMode: (state, action: PayloadAction<'simple' | 'advanced'>) => {
      state.mode = action.payload;
    },
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setSuggestions: (state, action: PayloadAction<Notice[]>) => {
      state.suggestions = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.suggestions = [];
      state.isOpen = false;
    },
  },
});

export const { setQuery, setMode, setIsOpen, setSuggestions, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;