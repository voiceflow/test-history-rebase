import React from 'react';

import * as Project from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks/redux';

export const ProjectPreviewContext = React.createContext<boolean>(false);

export const ProjectPreviewProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const activeVersionID = useSelector(Session.activeVersionIDSelector);
  const projectVersionID = useSelector(Project.active.versionIDSelector);

  const isPreview = React.useMemo(() => activeVersionID !== projectVersionID, [activeVersionID, projectVersionID]);

  return <ProjectPreviewContext.Provider value={isPreview}>{children}</ProjectPreviewContext.Provider>;
};

export const useProjectPreview = () => React.useContext(ProjectPreviewContext);
