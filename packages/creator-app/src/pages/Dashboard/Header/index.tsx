import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Header from '@/components/Header';
import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks';

import CenterNavSection from './CenterNavSection';
import LeftNavSection from './LeftNavSection';
import RightNavSection from './RightNavSection';
import SecondaryNav from './SecondaryNav';

interface DashboardHeaderProps {
  loadingProjects: boolean;
  workspace: Realtime.Workspace | null;
  handleFilterText: (text: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ loadingProjects, handleFilterText, workspace: activeWorkspace }) => {
  const [canConfigureWorkspace] = usePermission(Permission.CONFIGURE_WORKSPACE);

  return (
    <Header
      withLogo
      logoAssetPath={activeWorkspace?.image}
      leftRenderer={() => <LeftNavSection loadingProjects={loadingProjects} activeWorkspace={activeWorkspace} />}
      rightRenderer={() => <RightNavSection />}
      centerRenderer={() => <CenterNavSection />}
      disableLogoClick={!canConfigureWorkspace}
      subHeaderRenderer={() => <SecondaryNav handleFilterText={handleFilterText} workspace={activeWorkspace} />}
    />
  );
};

export default DashboardHeader;
