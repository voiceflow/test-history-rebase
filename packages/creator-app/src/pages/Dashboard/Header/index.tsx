import React from 'react';

import Header from '@/components/Header';
import { Permission } from '@/constants/permissions';
import * as Router from '@/ducks/router';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission } from '@/hooks/permission';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';

import CenterNavSection from './CenterNavSection';
import LeftNavSection from './LeftNavSection';
import RightNavSection from './RightNavSection';
import SecondaryNav from './SecondaryNav';

interface DashboardHeaderProps {
  handleFilterText: (text: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ handleFilterText }) => {
  const image = useSelector(WorkspaceV2.active.imageSelector);

  const goToWorkspaceSettings = useDispatch(Router.goToCurrentWorkspaceSettings);

  const [canConfigureWorkspace] = usePermission(Permission.CONFIGURE_WORKSPACE);

  return (
    <Header
      withLogo
      onLogoClick={() => goToWorkspaceSettings()}
      leftRenderer={() => <LeftNavSection />}
      rightRenderer={() => <RightNavSection />}
      logoAssetPath={image}
      centerRenderer={() => <CenterNavSection />}
      disableLogoClick={!canConfigureWorkspace}
      subHeaderRenderer={() => <SecondaryNav handleFilterText={handleFilterText} />}
    />
  );
};

export default DashboardHeader;
