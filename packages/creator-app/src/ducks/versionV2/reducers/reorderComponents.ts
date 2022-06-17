import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const reorderComponentsReducer = createReducer(Realtime.version.reorderComponents, (state, { versionID, fromID, toIndex }) => {
  const version = Normal.getOne(state, versionID);

  if (!version) return;

  const from = version.components.findIndex((component) => component.sourceID === fromID);

  if (from !== toIndex) {
    version.components = Utils.array.reorder(version.components, from, toIndex);
  }
});

export default reorderComponentsReducer;
