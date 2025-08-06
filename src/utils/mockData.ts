import { Directory, Notice } from '../types';

// Mock data for development (since we don't have the backend running)
export const mockDirectories: Directory[] = [
  { id: '1', name: 'Corporative', parentId: null, expanded: false },
  { id: '2', name: 'Private', parentId: null, expanded: false },
  { id: '3', name: 'Family', parentId: null, expanded: true },
  { id: '4', name: 'Passwords', parentId: null, expanded: false },
  { id: '5', name: 'Other activities', parentId: null, expanded: false },
];

export const mockNotices: Notice[] = [
  {
    id: '1',
    directoryId: '3',
    title: 'Future birthdays',
    description: '19.09 - Alice\n21.10 - Bob\n23.10 - Marry',
    tags: ['Family', 'Important'],
    position: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    directoryId: '3',
    title: 'Daily tasks',
    description: 'Morning routine:\n- Check emails\n- Review calendar\n- Plan priorities',
    tags: ['Family'],
    position: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    directoryId: '3',
    title: 'Budget',
    description: 'Monthly budget tracking and expense planning',
    tags: ['Finance', 'Important'],
    position: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    directoryId: '1',
    title: 'Meeting Notes',
    description: 'Q4 planning meeting notes and action items',
    tags: ['Work', 'Meetings'],
    position: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    directoryId: '2',
    title: 'Book List',
    description: 'Books to read this year',
    tags: ['Personal', 'Reading'],
    position: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];