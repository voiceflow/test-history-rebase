import { Models as BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const addDiagramReducer = createReducer(Realtime.diagram.crud.add, (state, { versionID, key, value }) => {
  const version = safeGetNormalizedByKey(state, versionID);

  if (!version) return;

  if (value.type === BaseModels.DiagramType.TOPIC) {
    version.topics.push({ sourceID: key, type: BaseModels.VersionFolderItemType.DIAGRAM });
  } else if (value.type === BaseModels.DiagramType.COMPONENT) {
    version.components.push({ sourceID: key, type: BaseModels.VersionFolderItemType.DIAGRAM });
  }
});

export default addDiagramReducer;
