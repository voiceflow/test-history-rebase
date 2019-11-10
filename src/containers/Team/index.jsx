import React from 'react';
import { Link, Switch } from 'react-router-dom';
import { compose } from 'recompose';

import PrivateRoute from '@/Routes/PrivateRoute';
import Button from '@/components/Button';
import Dashboard from '@/containers/Dashboard';
import Onboarding from '@/containers/Onboarding';
import Templates from '@/containers/Templates';
import { TeamsLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import { getActivePageAndMatch } from '@/utils/routes';

const PAGES_MATCHES = {
  template: ['/team/template', '/team/template/:board_id'],
  dashboard: ['/team/:teamID', '/dashboard'],
  onboarding: ['/onboarding'],
};

function Team({ team, teams, team_id }) {
  if (teams.allIds.length === 0) {
    return (
      <div className="h-100 d-flex justify-content-center">
        <div className="align-self-center text-center">
          <img src="/images/icons/conversation.svg" alt="skill-icon" width="160" height="105" className="mb-1" />
          <br />
          <label className="dark">Create a Board</label>
          <span className="text-muted">
            Create a shared board where your
            <br />
            team can collaboratively design and build
            <br />
            incredible voice experiences
          </span>
          <br />
          <Link to="/team/new" className="no-underline">
            <Button isPrimary className="mt-4">
              New Board
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <PrivateRoute exact team={team} teams={teams} team_id={team_id} path={['/team/template', '/team/template/:board_id']} component={Templates} />
      <PrivateRoute exact team={team} teams={teams} path={['/team/:teamID', '/dashboard']} team_id={team_id} component={Dashboard} />
      <PrivateRoute exact team={team} teams={teams} team_id={team_id} path="/onboarding" component={Onboarding} />
    </Switch>
  );
}

const mapStateToProps = ({ team }) => ({
  team: team.byId[team.team_id],
  teams: team,
  team_id: team.team_id,
});

export default compose(
  connect(
    mapStateToProps,
    {}
  ),
  withBatchLoadingGate([
    TeamsLoadingGate,
    ({ location }) => {
      const { activePage, activePageMatch } = getActivePageAndMatch(PAGES_MATCHES, location.pathname);

      return {
        urlTeamID: activePageMatch?.params?.teamID,
        activePage,
      };
    },
  ])
)(Team);
