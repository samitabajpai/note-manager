import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Edit2, Save, Tag, ArrowLeft } from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { updateNotice } from '../../store/slices/noticesSlice';
import { setShowNoteDetail } from '../../store/slices/uiSlice';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export const NoteDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedNoticeId = useSelector((state: RootState) => state.notices.selectedId);
  const notices = useSelector((state: RootState) => state.notices.items);
  
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const selectedNotice = notices.find(notice => notice.id === selectedNoticeId);

  useEffect(() => {
    if (selectedNotice) {
      setTitle(selectedNotice.title);
      setDescription(selectedNotice.description);
      setTags(selectedNotice.tags);
    }
  }, [selectedNotice]);

  const handleClose = () => {
    dispatch(setShowNoteDetail(false));
    setIsEditing(false);
  };

  const handleSave = () => {
    if (selectedNotice) {
      dispatch(updateNotice({
        id: selectedNotice.id,
        title: title.trim(),
        description: description.trim(),
        tags
      }));
      setIsEditing(false);
    }
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  if (!selectedNotice) {
    return null;
  }

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Note Details</h2>
          <div className="flex gap-2">
            {!isEditing ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit note</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSave}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save changes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Close</p>
                </TooltipContent>
                </Tooltip>
              </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Title</label>
          {isEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
            />
          ) : (
            <h3 className="font-medium">{selectedNotice.title}</h3>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          {isEditing ? (
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Note description"
              rows={8}
              className="resize-none"
            />
          ) : (
            <div className="whitespace-pre-wrap text-sm">
              {selectedNotice.description || 'No description'}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="bg-tag-bg text-tag-text"
              >
                {tag}
                {isEditing && (
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </button>
                )}
              </Badge>
            ))}
          </div>
          
          {isEditing && (
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tag"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              >
                <Tag className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground pt-4 border-t border-border">
          <div>Created: {new Date(selectedNotice.createdAt).toLocaleString()}</div>
          <div>Updated: {new Date(selectedNotice.updatedAt).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};