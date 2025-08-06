import { Directory } from '../../types';
import { DirectoryItem } from './DirectoryItem';

interface DirectoryTreeProps {
  directories: Directory[];
  level?: number;
}

export const DirectoryTree = ({ directories, level = 0 }: DirectoryTreeProps) => {
  return (
    <div>
      {directories.map((directory) => (
        <DirectoryItem key={directory.id} directory={directory} level={level} />
      ))}
    </div>
  );
};