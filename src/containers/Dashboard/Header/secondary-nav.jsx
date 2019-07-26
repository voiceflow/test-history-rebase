import React from 'react';
import { Link } from 'react-router-dom';

import SvgIcon from '@/components/SvgIcon';
import { Members } from '@/components/User/User';
import PowerIcon from '@/svgs/images/icons/power.svg';

import TeamSettings from '../TeamSettings';

export default function SecondaryNav({ teams, team_id: selectedTeamId, team: selectedTeam, team_setting, setTeamSetting, fetchBoards }) {
  return (
    <div id="secondary-nav">
      <div className="board-tabs">
        {teams.allIds.map((team_id) => {
          const team = teams.byId[team_id];
          if (team.team_id === selectedTeamId) {
            return (
              <div key={team.team_id} className="nav-item active">
                {team.name}
              </div>
            );
          }
          return (
            <Link key={team.team_id} className="nav-item" to={`/team/${team.team_id}`} onClick={() => fetchBoards && fetchBoards.abort()}>
              {team.name}
            </Link>
          );
        })}
        {teams.allIds.length < 3 && (
          <Link className="nav-item" to="/team/new">
            <img src="/add-board.svg" className="mr-1 mb-1" height={15} width={15} alt="add" /> New Board
          </Link>
        )}
      </div>
      <div className="super-center">
        {selectedTeam && (
          <>
            <div className="add-collaborators" onClick={() => setTeamSetting('MEMBERS')}>
              <SvgIcon icon={PowerIcon} color="inherit" />
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
