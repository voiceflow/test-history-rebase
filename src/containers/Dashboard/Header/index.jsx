import React from 'react';
import { Input } from 'reactstrap';

import Header from '@/components/Header';

import RightNavSection from './right-nav-section';
import SecondaryNav from './secondary-nav';

export default function DashboardHeader({
  history,
  handleFilterText,
  updateButtonClick,
  show_update_bubble,
  setNewProductUpdates,
  setShowUpdateBubble,
  product_updates,
  new_product_updates,
  teams,
  team_id,
  team,
  fetchBoards,
  team_setting,
  setTeamSetting,
  updatesCount,
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
      rightRenderer={() => (
        <RightNavSection
          setNewProductUpdates={setNewProductUpdates}
          setShowUpdateBubble={setShowUpdateBubble}
          product_updates={product_updates}
          new_product_updates={new_product_updates}
          show_update_bubble={show_update_bubble}
          updateButtonClick={updateButtonClick}
          updatesCount={updatesCount}
        />
      )}
      subHeaderRenderer={() => (
        <SecondaryNav
          teams={teams}
          team={team}
          team_id={team_id}
          team_setting={team_setting}
          setTeamSetting={setTeamSetting}
          fetchBoards={fetchBoards}
        />
      )}
    />
  );
}
