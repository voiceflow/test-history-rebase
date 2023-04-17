import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const updateNameReducer = createReducer(Realtime.workspace.updateName, (state, { workspaceID, name }) => {
  const workspace = Normal.getOne(state, workspaceID);

  if (!workspace) return;

  workspace.name = name;
});

export default updateNameReducer;
