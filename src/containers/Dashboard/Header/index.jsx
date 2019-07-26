import React from 'react';
import { Input } from 'reactstrap';

import Header from '@/components/Header';

import RightNavSection from './right-nav-section';
import SecondaryNav from './secondary-nav';

export default function DashboardHeader({
  history,
  handleFilterText,
  renderUpdatesButton,
  updates_open,
  toggleUpdatesOpen,
  setNewProductUpdates,
  setShowUpdateBubble,
  product_updates,
  new_product_updates,
  showInfo,
  setShowInfo,
  teams,
  team_id,
  team,
  fetchBoards,
  team_setting,
  setTeamSetting,
}) {
  return (
    <Header
      withLogo
      history={history}
      leftRenderer={() => (
        <div className="searchBar">
          <Input
            name="filter_text"
            className="search-input form-control-2"
            placeholder="Search Projects"
            onChange={(e) => handleFilterText(e.target.value)}
          />
        </div>
      )}
      rightRenderer={() => (
        <RightNavSection
          updates_open={updates_open}
          toggleUpdatesOpen={toggleUpdatesOpen}
          setNewProductUpdates={setNewProductUpdates}
          setShowUpdateBubble={setShowUpdateBubble}
          product_updates={product_updates}
          new_product_updates={new_product_updates}
          showInfo={showInfo}
          setShowInfo={setShowInfo}
          renderUpdatesButton={renderUpdatesButton}
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
