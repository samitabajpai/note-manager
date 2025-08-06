import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Plus, Edit2, Trash2 } from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { 
  selectDirectory, 
  toggleDirectoryExpanded, 
  createDirectory, 
  deleteDirectory, 
  updateDirectory 
} from '../../store/slices/directoriesSlice';
import { startEditingDirectory, stopEditing } from '../../store/slices/uiSlice';
import { Directory } from '../../types';
import { DirectoryTree } from './DirectoryTree';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '../../lib/utils';

interface DirectoryItemProps {
  directory: Directory;
  level: number;
}

export const DirectoryItem = ({ directory, level }: DirectoryItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedDirectoryId = useSelector((state: RootState) => state.directories.selectedId);
  const { isEditingDirectory, editingItemId } = useSelector((state: RootState) => state.ui);
  
  const [editingName, setEditingName] = useState(directory.name);
  const [showActions, setShowActions] = useState(false);

  const isSelected = selectedDirectoryId === directory.id;
  const isExpanded = directory.expanded;
  const hasChildren = directory.children && directory.children.length > 0;
  const isEditing = isEditingDirectory && editingItemId === directory.id;

  const handleSelect = () => {
    dispatch(selectDirectory(directory.id));
  };

  const handleToggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleDirectoryExpanded(directory.id));
  };

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(startEditingDirectory(directory.id));
    setEditingName(directory.name);
  };

  const handleSaveEdit = () => {
    if (editingName.trim() && editingName !== directory.name) {
      dispatch(updateDirectory({ id: directory.id, name: editingName.trim() }));
    }
    dispatch(stopEditing());
  };

  const handleCancelEdit = () => {
    setEditingName(directory.name);
    dispatch(stopEditing());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleCreateChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    const name = prompt('Enter directory name:');
    if (name) {
      dispatch(createDirectory({ name, parentId: directory.id }));
      if (!isExpanded) {
        dispatch(toggleDirectoryExpanded(directory.id));
      }
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${directory.name}"?`)) {
      dispatch(deleteDirectory(directory.id));
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer group transition-colors",
          "hover:bg-sidebar-hover",
          isSelected && "bg-sidebar-selected"
        )}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={handleSelect}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {hasChildren && (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={handleToggleExpanded}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}
        
        {!hasChildren && <div className="w-4" />}
        
        {isExpanded ? (
          <FolderOpen className="h-4 w-4 text-primary" />
        ) : (
          <Folder className="h-4 w-4 text-muted-foreground" />
        )}

        {isEditing ? (
          <Input
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            className="h-6 text-sm"
            autoFocus
          />
        ) : (
          <span className="flex-1 text-sm">{directory.name}</span>
        )}

        {showActions && !isEditing && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={handleCreateChild}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add subfolder</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={handleStartEdit}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Rename folder</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete folder</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      {isExpanded && hasChildren && (
        <DirectoryTree directories={directory.children!} level={level + 1} />
      )}
    </div>
  );
};