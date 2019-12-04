import React from 'react';
import { Input } from 'reactstrap';

import Header from '@/components/Header';

import RightNavSection from './RightNavSection';
import SecondaryNav from './SecondaryNav';
import UpgradeButton from './UpgradeButton/index';

export default function DashboardHeader({
  user,
  history,
  handleFilterText,
  workspaces,
  workspaceID,
  workspace,
  fetchBoards,
  team_setting,
  setTeamSetting,
}) {
  return (
    <Header
      withLogo
      disableLogoClick
      history={history}
      leftRenderer={() => (
        <div className="searchBar">
          <Input
            name="filter_text"
            className="search-input border-none"
            placeholder="Search Projects"
            onChange={(e) => handleFilterText(e.target.value)}
          />
        </div>
      )}
      rightRenderer={() => <RightNavSection />}
      centerRenderer={() => <UpgradeButton />}
      subHeaderRenderer={() => (
        <SecondaryNav
          user={user}
          workspaces={workspaces}
          workspace={workspace}
          workspaceID={workspaceID}
          team_setting={team_setting}
          setTeamSetting={setTeamSetting}
          fetchBoards={fetchBoards}
        />
      )}
    />
  );
}
