import fetch from './fetch';

const ANALYTICS_PATH = 'analytics';

const analyticsClient = {
  trackCanvasTime: (workspaceID, projectID, skillID, duration) =>
    fetch.post(`${ANALYTICS_PATH}/track_canvas_time`, {
      duration,
      workspace_id: workspaceID,
      project_id: projectID,
      skill_id: skillID,
    }),

  trackInvitationSent: (workspaceID, email) => fetch.post(`${ANALYTICS_PATH}/track_invitation_sent`, { email, workspace_id: workspaceID }),

  trackInvitationCancelled: (workspaceID, email) => fetch.post(`${ANALYTICS_PATH}/track_invitation_cancelled`, { email, workspace_id: workspaceID }),

  trackInvitationAccepted: (workspaceID, email) => fetch.post(`${ANALYTICS_PATH}/track_invitation_accepted`, { email, workspace_id: workspaceID }),

  trackProjectOpened: (workspaceID, projectID, skillID) =>
    fetch.post(`${ANALYTICS_PATH}/track_project_opened`, {
      workspace_id: workspaceID,
      project_id: projectID,
      skill_id: skillID,
    }),
};
export default analyticsClient;
