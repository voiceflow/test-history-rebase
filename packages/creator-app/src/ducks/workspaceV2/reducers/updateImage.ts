import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const updateImageReducer = createReducer(Realtime.workspace.updateImage, (state, { workspaceID, image }) => {
  const workspace = Normal.getOne(state, workspaceID);

  if (!workspace) return;

  workspace.image = image;
});

export default updateImageReducer;
