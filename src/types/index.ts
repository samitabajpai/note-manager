export interface Directory {
  id: string;
  name: string;
  parentId: string | null;
  children?: Directory[];
  expanded?: boolean;
}

export interface Notice {
  id: string;
  directoryId: string;
  title: string;
  description: string;
  tags: string[];
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  name: string;
  count: number;
}

export interface SearchState {
  query: string;
  mode: 'simple' | 'advanced';
  isOpen: boolean;
  suggestions: Notice[];
}

export interface AppState {
  directories: Directory[];
  notices: Notice[];
  selectedDirectoryId: string | null;
  selectedNoticeId: string | null;
  search: SearchState;
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
}