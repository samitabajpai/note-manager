import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, FolderPlus } from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { fetchDirectories, createDirectory } from '../../store/slices/directoriesSlice';
import { DirectoryTree } from '../Directory/DirectoryTree';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: directories, isLoading } = useSelector((state: RootState) => state.directories);

  useEffect(() => {
    dispatch(fetchDirectories());
  }, [dispatch]);

  const handleCreateDirectory = () => {
    const name = prompt('Enter directory name:');
    if (name) {
      dispatch(createDirectory({ name, parentId: null }));
    }
  };

  return (
    <div className="w-80 bg-sidebar-bg border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-foreground">Note Manager</h1>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCreateDirectory}
                    className="h-8 w-8 p-0"
                  >
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create new folder</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading directories...</div>
        ) : (
          <DirectoryTree directories={directories} />
        )}
      </div>
    </div>
  );
};