import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter } from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { setQuery, setMode, setIsOpen, setSuggestions } from '../../store/slices/searchSlice';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '../../lib/utils';

export const SearchBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { query, mode, isOpen, suggestions } = useSelector((state: RootState) => state.search);
  const notices = useSelector((state: RootState) => state.notices.items);
  
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleQueryChange = (value: string) => {
    dispatch(setQuery(value));
    
    if (value.trim().length > 1) {
      const filtered = notices.filter(notice => {
        if (mode === 'simple') {
          return notice.title.toLowerCase().includes(value.toLowerCase());
        } else {
          return (
            notice.title.toLowerCase().includes(value.toLowerCase()) ||
            notice.description.toLowerCase().includes(value.toLowerCase()) ||
            notice.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
          );
        }
      }).slice(0, 5);
      
      dispatch(setSuggestions(filtered));
      dispatch(setIsOpen(true));
    } else {
      dispatch(setSuggestions([]));
      dispatch(setIsOpen(false));
    }
  };

  const handleSuggestionClick = (notice: any) => {
    dispatch(setQuery(notice.title));
    dispatch(setIsOpen(false));
    // Navigate to search results or note detail
  };

  const toggleMode = () => {
    dispatch(setMode(mode === 'simple' ? 'advanced' : 'simple'));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        dispatch(setIsOpen(false));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  return (
    <div className="relative w-full max-w-2xl">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search notes..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="pl-10 bg-search-bg border-search-border focus:border-search-focus"
          />
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={mode === 'advanced' ? 'default' : 'outline'}
                size="sm"
                onClick={toggleMode}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {mode === 'advanced' && <Badge variant="secondary" className="text-xs">Advanced</Badge>}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{mode === 'simple' ? 'Switch to advanced search' : 'Switch to simple search'}</p>
              <p className="text-xs text-muted-foreground">
                {mode === 'simple' 
                  ? 'Search titles only' 
                  : 'Search titles, content, and tags'
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((notice) => (
            <div
              key={notice.id}
              className="px-4 py-2 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
              onClick={() => handleSuggestionClick(notice)}
            >
              <div className="font-medium text-sm">{notice.title}</div>
              <div className="text-xs text-muted-foreground truncate">{notice.description}</div>
              {notice.tags.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {notice.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {notice.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{notice.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};