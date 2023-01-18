import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const toggleDashboardKanbanReducer = createReducer(Realtime.workspace.settings.toggleDashboardKanban, (state, { workspaceID, enabled }) => {
  const workspace = Normal.getOne(state, workspaceID);

  if (!workspace) return;

  workspace.settings = workspace.settings ? { ...workspace.settings, dashboardKanban: enabled } : { dashboardKanban: enabled };
});

export default toggleDashboardKanbanReducer;
