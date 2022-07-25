import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const removeDiagramReducer = createReducer(Realtime.diagram.crud.remove, (state, { versionID, key }, { meta }) => {
  const version = Normal.getOne(state, versionID);

  if (!version) return;

  if (!meta?.assistantIAEnabled) {
    version.topics = version.topics.filter((topic) => topic.sourceID !== key);
  }

  version.components = version.components.filter((component) => component.sourceID !== key);
});

export default removeDiagramReducer;
