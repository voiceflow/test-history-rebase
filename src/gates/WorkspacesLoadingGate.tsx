import { History, Location } from 'history';
import queryString from 'query-string';
import React, { Component } from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Account from '@/ducks/account';
import * as Modal from '@/ducks/modal';
import * as Tracking from '@/ducks/tracking';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { Query } from '@/models';
import { ConnectedProps, MergeArguments } from '@/types';

const DASHBOARD_PATH = '/dashboard';

export type WorkspacesLoadingGateProps = {
  history: History;
  location: Location;
  urlWorkspaceID: string;
  activePage?: string;
};

class WorkspacesLoadingGate extends Component<WorkspacesLoadingGateProps & ConnectedWorkspacesLoadingGateProps> {
  state = {
    loaded: false,
  };

  updateWorkspace(workspaceID: string) {
    const { history, location, activePage } = this.props;

    if (activePage === 'dashboard') {
      history.push({ pathname: `/workspace/${workspaceID}`, search: location.search });
    }
  }

  async showInviteModal() {
    const { history, location, setModal, validateInvite, trackInvitationAccepted } = this.props;

    if (location.search) {
      const query: Query.Onboarding = queryString.parse(location.search);

      if (query.invite) {
        const newWorkspaceID = await validateInvite(query.invite);
        const inviteSource = query.email ? 'email' : 'link';

        if (!newWorkspaceID) return;

        setModal({
          size: 'sm',
          header: true,
          body: (
            <div className="text-center py-1 mb-5 text-muted">
              <img src="/images/takeoff.svg" height={140} alt="blast off" />
              <br />
              <br />
              Successfully Accepted Invite
              <br />
              Welcome to Voiceflow
            </div>
          ),
        });

        trackInvitationAccepted(newWorkspaceID, inviteSource);

        history.push({ search: '' });
      }
    }
  }

  load = async () => {
    const { activePage } = this.props;

    if (activePage !== 'onboarding') {
      await this.showInviteModal();
    }

    await this.props.fetchWorkspaces();

    if (this.props.workspaces.length > 0) {
      const urlWorkspaceID = this.props.urlWorkspaceID;
      if (!this.props.workspaceID) {
        this.props.updateCurrentWorkspace(urlWorkspaceID || this.props.workspaces[0]?.id);
      }
      if (!urlWorkspaceID && this.props.activePage !== 'template') this.updateWorkspace(this.props.workspaceID!);
    } else {
      if (this.props.location.pathname !== DASHBOARD_PATH)
        this.props.history.push({
          pathname: DASHBOARD_PATH,
          search: this.props.location.search,
        });
    }

    this.setState({ loaded: true });
  };

  componentDidUpdate(prevProps: WorkspacesLoadingGateProps & ConnectedWorkspacesLoadingGateProps) {
    const { workspaceID, urlWorkspaceID, history, updateCurrentWorkspace } = this.props;

    // If redux store updated and url doesn't match
    if (prevProps.workspaceID !== workspaceID && workspaceID !== urlWorkspaceID) {
      this.updateWorkspace(workspaceID!);
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
  workspaces: Workspace.allWorkspacesSelector,
  workspaceID: Workspace.activeWorkspaceIDSelector,
  getWorkspace: Workspace.workspaceByIDSelector,
  email: Account.userEmailSelector,
};

const mapDispatchToProps = {
  fetchWorkspaces: Workspace.fetchWorkspaces,
  updateCurrentWorkspace: Workspace.updateCurrentWorkspace,
  validateInvite: Workspace.validateInvite,
  setModal: Modal.setModal,
  trackInvitationAccepted: Tracking.trackInvitationAccepted,
};

const mergeProps = (...[{ email }, { trackInvitationAccepted }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>) => ({
  trackInvitationAccepted: (workspaceID: string, source: string) => trackInvitationAccepted(workspaceID, email!, source),
});

type ConnectedWorkspacesLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(WorkspacesLoadingGate as any) as React.FC;
