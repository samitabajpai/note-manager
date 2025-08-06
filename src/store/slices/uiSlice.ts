import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarCollapsed: boolean;
  showNoteDetail: boolean;
  isEditingNote: boolean;
  isEditingDirectory: boolean;
  editingItemId: string | null;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  showNoteDetail: false,
  isEditingNote: false,
  isEditingDirectory: false,
  editingItemId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setShowNoteDetail: (state, action: PayloadAction<boolean>) => {
      state.showNoteDetail = action.payload;
    },
    startEditingNote: (state, action: PayloadAction<string>) => {
      state.isEditingNote = true;
      state.editingItemId = action.payload;
    },
    startEditingDirectory: (state, action: PayloadAction<string>) => {
      state.isEditingDirectory = true;
      state.editingItemId = action.payload;
    },
    stopEditing: (state) => {
      state.isEditingNote = false;
      state.isEditingDirectory = false;
      state.editingItemId = null;
    },
  },
});

export const { 
  toggleSidebar, 
  setShowNoteDetail, 
  startEditingNote, 
  startEditingDirectory, 
  stopEditing 
} = uiSlice.actions;

export default uiSlice.reducer;