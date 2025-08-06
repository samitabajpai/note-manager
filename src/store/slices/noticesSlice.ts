import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Notice } from '../../types';

// Async thunks for API calls
export const fetchNotices = createAsyncThunk(
  'notices/fetchNotices',
  async () => {
    // For demo purposes, use mock data
    // In production, replace with: const response = await fetch('/notices');
    const { mockNotices } = await import('../../utils/mockData');
    return mockNotices;
  }
);

export const createNotice = createAsyncThunk(
  'notices/createNotice',
  async (data: { directoryId: string; title: string; description: string; tags: string[] }) => {
    const response = await fetch('/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
);

export const updateNotice = createAsyncThunk(
  'notices/updateNotice',
  async (data: { id: string; title?: string; description?: string; tags?: string[]; position?: number }) => {
    const response = await fetch(`/notices/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
);

export const deleteNotice = createAsyncThunk(
  'notices/deleteNotice',
  async (id: string) => {
    await fetch(`/notices/${id}`, { method: 'DELETE' });
    return id;
  }
);

interface NoticesState {
  items: Notice[];
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: NoticesState = {
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
};

const noticesSlice = createSlice({
  name: 'notices',
  initialState,
  reducers: {
    selectNotice: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
    reorderNotices: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number; directoryId: string }>) => {
      const { sourceIndex, destinationIndex, directoryId } = action.payload;
      const directoryNotices = state.items.filter(notice => notice.directoryId === directoryId);
      
      if (sourceIndex !== destinationIndex) {
        const [removed] = directoryNotices.splice(sourceIndex, 1);
        directoryNotices.splice(destinationIndex, 0, removed);
        
        // Update positions
        directoryNotices.forEach((notice, index) => {
          notice.position = index;
        });
        
        // Update the main array
        state.items = state.items.filter(notice => notice.directoryId !== directoryId).concat(directoryNotices);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.sort((a: Notice, b: Notice) => a.position - b.position);
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch notices';
      })
      .addCase(createNotice.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateNotice.fulfilled, (state, action) => {
        const index = state.items.findIndex(notice => notice.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.items = state.items.filter(notice => notice.id !== action.payload);
        if (state.selectedId === action.payload) {
          state.selectedId = null;
        }
      });
  },
});

export const { selectNotice, reorderNotices } = noticesSlice.actions;
export default noticesSlice.reducer;