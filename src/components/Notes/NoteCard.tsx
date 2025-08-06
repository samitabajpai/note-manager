import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Edit2, Trash2, FileText } from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { deleteNotice, selectNotice } from '../../store/slices/noticesSlice';
import { setShowNoteDetail } from '../../store/slices/uiSlice';
import { Notice } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface NoteCardProps {
  notice: Notice;
}

export const NoteCard = ({ notice }: NoteCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showActions, setShowActions] = useState(false);

  const handleClick = () => {
    dispatch(selectNotice(notice.id));
    dispatch(setShowNoteDetail(true));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Open edit modal
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${notice.title}"?`)) {
      dispatch(deleteNotice(notice.id));
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all duration-200 bg-note-card hover:bg-note-card-hover group"
      onClick={handleClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            <FileText className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium truncate">
              {notice.title}
            </CardTitle>
          </div>
          
          {showActions && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={handleEdit}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit note</p>
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
                    <p>Delete note</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {notice.description || 'No description'}
        </p>
        
        {notice.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {notice.tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs bg-tag-bg text-tag-text"
              >
                {tag}
              </Badge>
            ))}
            {notice.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-tag-bg text-tag-text">
                +{notice.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mt-2">
          {new Date(notice.updatedAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};