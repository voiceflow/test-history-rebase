// Components
import * as _ from 'lodash';
import queryString from 'query-string';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Button from '@/components/Button';
import { FullSpinner } from '@/components/Spinner';
import Dashboard from '@/containers/Dashboard';
// Views
import Onboarding from '@/containers/Onboarding';
import Templates from '@/containers/Templates';
import { setConfirm, setError, setModal } from '@/ducks/modal';
// Actions
import { fetchTeams, teamInvite, updateCurrentTeam } from '@/ducks/team';

const DASHBOARD_PATH = '/dashboard';

const getTeamFromURL = (computedMatch) => _.get(computedMatch, ['params', 'team_id']);

class Team extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  updateTeam(team_id) {
    if (!this.props.page) this.props.history.push(`/team/${team_id}`);
  }

  async initialize() {
    if (this.props.location.search) {
      const query = queryString.parse(this.props.location.search);
      if (query.invite && (await this.props.teamInvite(query.invite))) {
        this.props.setModal({
          size: 'sm',
          header: true,
          body: (
            <div className="text-center py-1 mb-5 text-muted">
              <img src="/images/icons/takeoff.svg" height={140} alt="blast off" />
              <br />
              <br />
              Successfully Accepted Invite
              <br />
              Welcome to Voiceflow
            </div>
          ),
        });
      }
    }

    await this.props.fetchTeams();

    this.setState({ loading: false });
    if (this.props.teams.allIds.length > 0) {
      const urlTeam = getTeamFromURL(this.props.computedMatch);
      if (!this.props.team_id) {
        this.props.updateCurrentTeam(urlTeam || this.props.teams.allIds[0]);
      }
      if (!urlTeam && this.props.page !== 'template') this.updateTeam(this.props.team_id);
    } else {
      if (this.props.location.pathname !== DASHBOARD_PATH)
        this.props.history.push({
          pathname: DASHBOARD_PATH,
          search: this.props.location.search,
        });
    }
  }

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(prevProps) {
    const new_team = getTeamFromURL(this.props.computedMatch);
    // If redux store updated and url doesn't match
    if (prevProps.team_id !== this.props.team_id && this.props.team_id !== new_team) {
      this.updateTeam(this.props.team_id);
      // If url updated and redux store doesn't match
    } else if (new_team && this.props.team_id !== new_team) {
      this.props.updateCurrentTeam(new_team);
      // If redux store updated and it went into no team
    } else if (prevProps.team_id && !this.props.team_id) {
      this.props.history.push(DASHBOARD_PATH);
    }
  }

  render() {
    if (this.state.loading) return <FullSpinner name="Team" />;

    if (this.props.teams.allIds.length === 0) {
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

    switch (this.props.page) {
      case 'onboarding':
        return <Onboarding {...this.props} />;
      case 'template':
        return <Templates {...this.props} />;
      default:
        return <Dashboard {...this.props} />;
    }
  }
}

const mapStateToProps = (state) => ({
  team_id: state.team.team_id,
  team: state.team.byId[state.team.team_id],
  teams: state.team,
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTeams: () => dispatch(fetchTeams()),
    updateCurrentTeam: (team_id) => dispatch(updateCurrentTeam(team_id)),
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    setError: (err) => dispatch(setError(err)),
    teamInvite: (invite) => dispatch(teamInvite(invite)),
    setModal: (modal) => dispatch(setModal(modal)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Team);
