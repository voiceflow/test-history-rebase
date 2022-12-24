import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const loadQuotasReducer = createReducer(Realtime.workspace.quotas.loadAll, (state, { workspaceID, quotas }) => {
  const workspace = Normal.getOne(state, workspaceID);

  if (!workspace) return;

  workspace.quotas = quotas;
});

export default loadQuotasReducer;
