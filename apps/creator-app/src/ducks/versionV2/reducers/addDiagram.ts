import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { isComponentDiagram, isTemplateDiagram } from '@/utils/diagram.utils';

import { createReducer } from './utils';

const addDiagramReducer = createReducer(Realtime.diagram.crud.add, (state, { versionID, key, value }) => {
  const version = Normal.getOne(state, versionID);

  if (!version) return;

  if (isComponentDiagram(value.type)) {
    version.components.push({ sourceID: key, type: BaseModels.Version.FolderItemType.DIAGRAM });
  }

  if (isTemplateDiagram(value.type)) {
    version.templateDiagramID = value.id;
  }
});

export default addDiagramReducer;
