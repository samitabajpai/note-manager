import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus } from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { fetchNotices, createNotice, updateNotice } from '../../store/slices/noticesSlice';
import { reorderNotices } from '../../store/slices/noticesSlice';
import { NoteCard } from './NoteCard';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export const NotesGrid = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: notices, isLoading } = useSelector((state: RootState) => state.notices);
  const selectedDirectoryId = useSelector((state: RootState) => state.directories.selectedId);

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  const filteredNotices = selectedDirectoryId
    ? notices.filter(notice => notice.directoryId === selectedDirectoryId)
    : notices;

  const handleCreateNote = () => {
    if (!selectedDirectoryId) {
      alert('Please select a directory first');
      return;
    }

    const title = prompt('Enter note title:');
    if (title) {
      dispatch(createNotice({
        directoryId: selectedDirectoryId,
        title,
        description: '',
        tags: []
      }));
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || !selectedDirectoryId) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex !== destinationIndex) {
      dispatch(reorderNotices({
        sourceIndex,
        destinationIndex,
        directoryId: selectedDirectoryId
      }));

      // Update positions in backend
      const reorderedNotices = [...filteredNotices];
      const [moved] = reorderedNotices.splice(sourceIndex, 1);
      reorderedNotices.splice(destinationIndex, 0, moved);

      reorderedNotices.forEach((notice, index) => {
        if (notice.position !== index) {
          dispatch(updateNotice({
            id: notice.id,
            position: index
          }));
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading notes...</div>
      </div>
    );
  }

  if (!selectedDirectoryId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-muted-foreground">
          <h3 className="text-lg font-medium mb-2">Select a directory</h3>
          <p>Choose a directory from the sidebar to view its notes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Notes</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleCreateNote} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Note
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create a new note in the selected directory</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {filteredNotices.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          <h3 className="text-lg font-medium mb-2">No notes yet</h3>
          <p>Create your first note to get started</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="notes-grid">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filteredNotices.map((notice, index) => (
                  <Draggable key={notice.id} draggableId={notice.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${snapshot.isDragging ? 'rotate-3 scale-105' : ''} transition-transform`}
                      >
                        <NoteCard notice={notice} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};