import * as Realtime from '@voiceflow/realtime-sdk';

import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const updateImageReducer = createReducer(Realtime.workspace.updateImage, (state, { workspaceID, image }) => {
  const workspace = safeGetNormalizedByKey(state, workspaceID);

  if (workspace) {
    workspace.image = image;
  }
});

export default updateImageReducer;
