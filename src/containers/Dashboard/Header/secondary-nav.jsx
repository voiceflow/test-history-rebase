import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { Members } from '@/components/User/User';
import Tab from '@/componentsV2/Tab';

import TeamSettings from '../TeamSettings';
import { NewBoardTab, TabContainer, TabsContainer } from './components';

export default function SecondaryNav({ teams, team_id: selectedTeamId, team: selectedTeam, team_setting, setTeamSetting, fetchBoards }) {
  return (
    <div id="secondary-nav">
      <TabsContainer>
        {teams.allIds.map((team_id) => {
          const team = teams.byId[team_id];

          return (
            <TabContainer key={team.team_id} to={`/team/${team.team_id}`} onClick={() => fetchBoards && fetchBoards.abort()}>
              <Tab isActive={team.team_id === selectedTeamId}>{team.name}</Tab>
            </TabContainer>
          );
        })}

        {teams.allIds.length < 3 && (
          <NewBoardTab to="/team/new">
            <SvgIcon icon="addBoard" color="inherit" /> New Board
          </NewBoardTab>
        )}
      </TabsContainer>
      <div className="super-center">
        {selectedTeam && (
          <>
            <div className="add-collaborators" onClick={() => setTeamSetting('MEMBERS')}>
              <SvgIcon icon="power" color="inherit" />
              Add Collaborators
            </div>
            <Members members={selectedTeam.members} />
            <TeamSettings open={team_setting} update={(setting) => setTeamSetting(setting)} close={() => setTeamSetting(false)} />
          </>
        )}
      </div>
    </div>
  );
}
