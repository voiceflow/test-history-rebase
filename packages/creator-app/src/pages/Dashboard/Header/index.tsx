import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Header from '@/components/Header';
import { Permission } from '@/constants/permissions';
import * as Router from '@/ducks/router';
import { useDispatch, usePermission } from '@/hooks';

import CenterNavSection from './CenterNavSection';
import LeftNavSection from './LeftNavSection';
import RightNavSection from './RightNavSection';
import SecondaryNav from './SecondaryNav';

interface DashboardHeaderProps {
  workspace: Realtime.Workspace | null;
  handleFilterText: (text: string) => void;
}

const DashboardHeader: React.OldFC<DashboardHeaderProps> = ({ handleFilterText, workspace: activeWorkspace }) => {
  const [canConfigureWorkspace] = usePermission(Permission.CONFIGURE_WORKSPACE);
  const goToWorkspaceSettings = useDispatch(Router.goToCurrentWorkspaceSettings);

  return (
    <Header
      withLogo
      logoAssetPath={activeWorkspace?.image}
      leftRenderer={() => <LeftNavSection activeWorkspace={activeWorkspace} />}
      rightRenderer={() => <RightNavSection />}
      centerRenderer={() => <CenterNavSection />}
      disableLogoClick={!canConfigureWorkspace}
      onLogoClick={() => goToWorkspaceSettings()}
      subHeaderRenderer={() => <SecondaryNav handleFilterText={handleFilterText} workspace={activeWorkspace} />}
    />
  );
};

export default DashboardHeader;
