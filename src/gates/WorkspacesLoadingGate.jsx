import queryString from 'query-string';
import React, { Component } from 'react';

import LoadingGate from '@/components/LoadingGate';
import { setModal } from '@/ducks/modal';
import { activeWorkspaceIDSelector, allWorkspacesSelector, fetchWorkspaces, updateCurrentWorkspace, validateInvite } from '@/ducks/workspace';
import { connect } from '@/hocs';

const DASHBOARD_PATH = '/dashboard';

class WorkspacesLoadingGate extends Component {
  state = {
    loaded: false,
  };

  updateWorkspace(workspaceID) {
    const { history, location, activePage } = this.props;

    if (activePage === 'dashboard') {
      history.push({ pathname: `/workspace/${workspaceID}`, search: location.search });
    }
  }

  async showInviteModal() {
    const { history, location, setModal, validateInvite } = this.props;

    if (location.search) {
      const query = queryString.parse(location.search);

      if (query.invite && (await validateInvite(query.invite))) {
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

    await this.props.fetchWorkspaces();

    if (this.props.workspaces.length > 0) {
      const urlWorkspaceID = this.props.urlWorkspaceID;
      if (!this.props.workspaceID) {
        this.props.updateCurrentWorkspace(urlWorkspaceID || this.props.workspaces[0]?.id);
      }
      if (!urlWorkspaceID && this.props.page !== 'template') this.updateWorkspace(this.props.workspaceID);
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
    const { workspaceID, urlWorkspaceID, history, updateCurrentWorkspace } = this.props;

    // If redux store updated and url doesn't match
    if (prevProps.workspaceID !== workspaceID && workspaceID !== urlWorkspaceID) {
      this.updateWorkspace(workspaceID);
      // If url updated and redux store doesn't match
    } else if (urlWorkspaceID && workspaceID !== urlWorkspaceID) {
      updateCurrentWorkspace(urlWorkspaceID);
      // If redux store updated and it went into no workspace
    } else if (prevProps.workspaceID && !workspaceID) {
      history.push(DASHBOARD_PATH);
    }
  }

  render() {
    const { loaded } = this.state;
    const { children } = this.props;

    return (
      <LoadingGate label="Workspaces" isLoaded={loaded} load={this.load}>
        {children}
      </LoadingGate>
    );
  }
}

const mapStateToProps = {
  workspaces: allWorkspacesSelector,
  workspaceID: activeWorkspaceIDSelector,
};

const mapDispatchToProps = {
  fetchWorkspaces,
  updateCurrentWorkspace,
  validateInvite,
  setModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspacesLoadingGate);
