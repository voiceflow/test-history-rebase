import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const updateImageReducer = createReducer(Realtime.workspace.updateImage, (state, { workspaceID, image }) => {
  const workspace = Utils.normalized.safeGetNormalizedByKey(state, workspaceID);

  if (workspace) {
    workspace.image = image;
  }
});

export default updateImageReducer;
