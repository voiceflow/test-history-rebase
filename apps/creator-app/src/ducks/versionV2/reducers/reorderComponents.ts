import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const reorderComponentsReducer = createReducer(Realtime.version.reorderComponents, (state, { versionID, fromID, toIndex }) => {
  const version = Normal.getOne(state, versionID);

  if (!version) return;

  const fromIndex = version.components.findIndex((component) => component.sourceID === fromID);

  version.components = Utils.array.reorder(version.components, fromIndex, toIndex);
});

export default reorderComponentsReducer;
