import React from 'react';

import Header from '@/components/Header';
import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks';

import LeftNavSection from './LeftNavSection';
import RightNavSection from './RightNavSection';
import SecondaryNav from './SecondaryNav';
import UpgradeButton from './UpgradeButton';

const DashboardHeader = ({ user, loadingProjects, history, handleFilterText, workspaces, workspaceID, workspace: activeWorkspace, fetchBoards }) => {
  const [canConfigureWorkspace] = usePermission(Permission.CONFIGURE_WORKSPACE);
  return (
    <Header
      withLogo
      logoAssetPath={activeWorkspace.image}
      history={history}
      leftRenderer={() => <LeftNavSection loadingProjects={loadingProjects} workspaces={workspaces} activeWorkspace={activeWorkspace} />}
      rightRenderer={() => <RightNavSection />}
      centerRenderer={() => <UpgradeButton />}
      disableLogoClick={!canConfigureWorkspace}
      subHeaderRenderer={() => (
        <SecondaryNav
          handleFilterText={handleFilterText}
          user={user}
          workspaces={workspaces}
          workspace={activeWorkspace}
          workspaceID={workspaceID}
          fetchBoards={fetchBoards}
        />
      )}
    />
  );
};

export default DashboardHeader;
