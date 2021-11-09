import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const removeDiagramReducer = createReducer(Realtime.diagram.crud.remove, (state, { versionID, key }) => {
  const version = Utils.normalized.safeGetNormalizedByKey(state, versionID);

  if (!version) return;

  version.topics = version.topics.filter((topic) => topic.sourceID !== key);
  version.components = version.components.filter((component) => component.sourceID !== key);
});

export default removeDiagramReducer;
