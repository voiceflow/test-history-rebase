import { useLocation } from 'react-router-dom';

import { useAutoScrollNodeIntoView } from '@/hooks/scroll';
import { SettingSections } from '@/pages/Settings/constants';

export const useAutoScrollSectionIntoView = (section: SettingSections) => {
  const location = useLocation<{ section?: SettingSections }>();

  return useAutoScrollNodeIntoView<HTMLDivElement>({ condition: location.state?.section === section });
};
