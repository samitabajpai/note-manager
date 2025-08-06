import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { NoteDetail } from '../Notes/NoteDetail';

export const MainLayout = () => {
  const showNoteDetail = useSelector((state: RootState) => state.ui.showNoteDetail);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <MainContent />
      {showNoteDetail && <NoteDetail />}
    </div>
  );
};