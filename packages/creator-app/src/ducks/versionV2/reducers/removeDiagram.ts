import * as Realtime from '@voiceflow/realtime-sdk';

import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const removeDiagramReducer = createReducer(Realtime.diagram.crud.remove, (state, { versionID, key }) => {
  const version = safeGetNormalizedByKey(state, versionID);

  if (!version) return;

  version.topics = version.topics.filter((topic) => topic.sourceID !== key);
  version.components = version.components.filter((component) => component.sourceID !== key);
});

export default removeDiagramReducer;
