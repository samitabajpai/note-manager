import { SearchBar } from '../Search/SearchBar';
import { NotesGrid } from '../Notes/NotesGrid';

export const MainContent = () => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-border bg-background">
        <SearchBar />
      </div>
      <div className="flex-1 overflow-y-auto">
        <NotesGrid />
      </div>
    </div>
  );
};