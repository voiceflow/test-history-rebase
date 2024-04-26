import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const replaceSettingsReducer = createReducer(
  Realtime.workspace.settings.replace,
  (state, { workspaceID, settings }) => {
    const workspace = Normal.getOne(state, workspaceID);

    if (!workspace) return;

    workspace.settings = settings;
  }
);

export default replaceSettingsReducer;
