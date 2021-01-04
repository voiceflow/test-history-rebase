import React from 'react';

import Header from '@/components/Header';
import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks';
import { Workspace } from '@/models';

import LeftNavSection from './LeftNavSection';
import RightNavSection from './RightNavSection';
import SecondaryNav from './SecondaryNav';
import UpgradeButton from './UpgradeButton';

type DashboardHeaderProps = {
  loadingProjects: boolean;
  workspaces: Workspace[];
  workspace: Workspace | null;
  handleFilterText: (text: string) => void;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ loadingProjects, handleFilterText, workspaces, workspace: activeWorkspace }) => {
  const [canConfigureWorkspace] = usePermission(Permission.CONFIGURE_WORKSPACE);

  return (
    <Header
      withLogo
      logoAssetPath={activeWorkspace?.image}
      leftRenderer={() => <LeftNavSection loadingProjects={loadingProjects} workspaces={workspaces} activeWorkspace={activeWorkspace} />}
      rightRenderer={() => <RightNavSection />}
      centerRenderer={() => <UpgradeButton />}
      disableLogoClick={!canConfigureWorkspace}
      subHeaderRenderer={() => <SecondaryNav handleFilterText={handleFilterText} workspace={activeWorkspace} />}
    />
  );
};

export default DashboardHeader;
