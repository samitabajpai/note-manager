import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Directory } from '../../types';

// Async thunks for API calls
export const fetchDirectories = createAsyncThunk(
  'directories/fetchDirectories',
  async () => {
    // For demo purposes, use mock data
    // In production, replace with: const response = await fetch('/directories');
    const { mockDirectories } = await import('../../utils/mockData');
    return mockDirectories;
  }
);

export const createDirectory = createAsyncThunk(
  'directories/createDirectory',
  async (data: { name: string; parentId: string | null }) => {
    const response = await fetch('/directories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
);

export const updateDirectory = createAsyncThunk(
  'directories/updateDirectory',
  async (data: { id: string; name: string }) => {
    const response = await fetch(`/directories/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.name }),
    });
    return response.json();
  }
);

export const deleteDirectory = createAsyncThunk(
  'directories/deleteDirectory',
  async (id: string) => {
    await fetch(`/directories/${id}`, { method: 'DELETE' });
    return id;
  }
);

interface DirectoriesState {
  items: Directory[];
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DirectoriesState = {
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
};

const directoriesSlice = createSlice({
  name: 'directories',
  initialState,
  reducers: {
    selectDirectory: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
    toggleDirectoryExpanded: (state, action: PayloadAction<string>) => {
      const directory = findDirectoryById(state.items, action.payload);
      if (directory) {
        directory.expanded = !directory.expanded;
      }
    },
    updateDirectoryName: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const directory = findDirectoryById(state.items, action.payload.id);
      if (directory) {
        directory.name = action.payload.name;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDirectories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDirectories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = buildDirectoryTree(action.payload);
        // Auto-select Family folder for demo
        if (!state.selectedId) {
          const familyFolder = action.payload.find((dir: Directory) => dir.name === 'Family');
          if (familyFolder) {
            state.selectedId = familyFolder.id;
          }
        }
      })
      .addCase(fetchDirectories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch directories';
      })
      .addCase(createDirectory.fulfilled, (state, action) => {
        const newDirectory = action.payload;
        if (newDirectory.parentId) {
          const parent = findDirectoryById(state.items, newDirectory.parentId);
          if (parent) {
            if (!parent.children) parent.children = [];
            parent.children.push(newDirectory);
          }
        } else {
          state.items.push(newDirectory);
        }
      })
      .addCase(updateDirectory.fulfilled, (state, action) => {
        const directory = findDirectoryById(state.items, action.payload.id);
        if (directory) {
          directory.name = action.payload.name;
        }
      })
      .addCase(deleteDirectory.fulfilled, (state, action) => {
        state.items = removeDirectoryById(state.items, action.payload);
        if (state.selectedId === action.payload) {
          state.selectedId = null;
        }
      });
  },
});

// Helper functions
function buildDirectoryTree(directories: Directory[]): Directory[] {
  const map = new Map<string, Directory>();
  const roots: Directory[] = [];

  // Create map of all directories
  directories.forEach(dir => {
    map.set(dir.id, { ...dir, children: [], expanded: dir.expanded || false });
  });

  // Build tree structure
  directories.forEach(dir => {
    const directory = map.get(dir.id)!;
    if (dir.parentId && map.has(dir.parentId)) {
      const parent = map.get(dir.parentId)!;
      parent.children!.push(directory);
    } else {
      roots.push(directory);
    }
  });

  return roots;
}

function findDirectoryById(directories: Directory[], id: string): Directory | null {
  for (const dir of directories) {
    if (dir.id === id) return dir;
    if (dir.children) {
      const found = findDirectoryById(dir.children, id);
      if (found) return found;
    }
  }
  return null;
}

function removeDirectoryById(directories: Directory[], id: string): Directory[] {
  return directories.filter(dir => {
    if (dir.id === id) return false;
    if (dir.children) {
      dir.children = removeDirectoryById(dir.children, id);
    }
    return true;
  });
}

export const { selectDirectory, toggleDirectoryExpanded, updateDirectoryName } = directoriesSlice.actions;
export default directoriesSlice.reducer;