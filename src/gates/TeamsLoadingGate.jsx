import queryString from 'query-string';
import React, { Component } from 'react';

import LoadingGate from '@/components/LoadingGate';
import { setModal } from '@/ducks/modal';
import { fetchTeams, teamInvite, updateCurrentTeam } from '@/ducks/team';
import { connect } from '@/hocs';

const DASHBOARD_PATH = '/dashboard';

class TeamsLoadingGate extends Component {
  state = {
    loaded: false,
  };

  updateTeam(teamID) {
    const { history, location, activePage } = this.props;

    if (activePage === 'dashboard') {
      history.push({ pathname: `/team/${teamID}`, search: location.search });
    }
  }

  async showInviteModal() {
    const { history, location, setModal, teamInvite } = this.props;

    if (location.search) {
      const query = queryString.parse(location.search);

      if (query.invite && (await teamInvite(query.invite))) {
        setModal({
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

        history.push({ search: '' });
      }
    }
  }

  load = async () => {
    await this.showInviteModal();

    await this.props.fetchTeams();

    if (this.props.teams.allIds.length > 0) {
      const urlTeam = this.props.urlTeamID;
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

    this.setState({ loaded: true });
  };

  componentDidUpdate(prevProps) {
    const { teamID, urlTeamID, history, updateCurrentTeam } = this.props;

    // If redux store updated and url doesn't match
    if (prevProps.teamID !== teamID && teamID !== urlTeamID) {
      this.updateTeam(teamID);
      // If url updated and redux store doesn't match
    } else if (urlTeamID && teamID !== urlTeamID) {
      updateCurrentTeam(urlTeamID);
      // If redux store updated and it went into no team
    } else if (prevProps.teamID && !teamID) {
      history.push(DASHBOARD_PATH);
    }
  }

  render() {
    const { loaded } = this.state;
    const { children } = this.props;

    return (
      <LoadingGate label="Teams" isLoaded={loaded} load={this.load}>
        {children}
      </LoadingGate>
    );
  }
}

const mapStateToProps = ({ team }) => ({
  teams: team,
  teamID: team.team_id,
});

const mapDispatchToProps = {
  fetchTeams,
  updateCurrentTeam,
  teamInvite,
  setModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamsLoadingGate);
