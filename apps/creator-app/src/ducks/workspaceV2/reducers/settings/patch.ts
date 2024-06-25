import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const patchSettingsReducer = createReducer(
  Realtime.workspace.settings.patch,
  (state, { workspaceID, settings: settingsPayload }) => {
    const workspace = Normal.getOne(state, workspaceID);

    if (!workspace) return;

    workspace.settings = workspace.settings ? { ...workspace.settings, ...settingsPayload } : settingsPayload;
  }
);

export default patchSettingsReducer;
