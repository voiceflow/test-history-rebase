import fetch from './fetch';

const ANALYTICS_PATH = 'analytics';

const analyticsClient = {
  trackCanvasTime: (workspaceID: string, projectID: string, skillID: string, duration: number) =>
    fetch.post(`${ANALYTICS_PATH}/track_canvas_time`, {
      duration,
      workspace_id: workspaceID,
      project_id: projectID,
      skill_id: skillID,
    }),

  trackInvitationSent: (workspaceID: string, email: string) =>
    fetch.post(`${ANALYTICS_PATH}/track_invitation_sent`, { email, workspace_id: workspaceID }),

  trackInvitationCancelled: (workspaceID: string, email: string) =>
    fetch.post(`${ANALYTICS_PATH}/track_invitation_cancelled`, { email, workspace_id: workspaceID }),

  trackInvitationAccepted: (workspaceID: string, email: string) =>
    fetch.post(`${ANALYTICS_PATH}/track_invitation_accepted`, { email, workspace_id: workspaceID }),

  trackProjectOpened: (workspaceID: string, projectID: string, skillID: string) =>
    fetch.post(`${ANALYTICS_PATH}/track_project_opened`, {
      workspace_id: workspaceID,
      project_id: projectID,
      skill_id: skillID,
    }),
};

export default analyticsClient;
