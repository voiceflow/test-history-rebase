import React from 'react';

import Header from '@/components/Header';

import LeftNavSection from './LeftNavSection';
import RightNavSection from './RightNavSection';
import SecondaryNav from './SecondaryNav';
import UpgradeButton from './UpgradeButton';

const DashboardHeader = ({
  user,
  history,
  handleFilterText,
  workspaces,
  workspaceID,
  workspace: activeWorkspace,
  fetchBoards,
  team_setting,
  setTeamSetting,
}) => {
  return (
    <Header
      withLogo
      logoAssetPath={activeWorkspace.image}
      disableLogoClick
      history={history}
      leftRenderer={() => <LeftNavSection workspaces={workspaces} activeWorkspace={activeWorkspace} />}
      rightRenderer={() => <RightNavSection />}
      centerRenderer={() => <UpgradeButton />}
      subHeaderRenderer={() => (
        <SecondaryNav
          handleFilterText={handleFilterText}
          user={user}
          workspaces={workspaces}
          workspace={activeWorkspace}
          workspaceID={workspaceID}
          team_setting={team_setting}
          setTeamSetting={setTeamSetting}
          fetchBoards={fetchBoards}
        />
      )}
    />
  );
};

export default DashboardHeader;
