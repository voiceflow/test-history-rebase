import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { isTemplateDiagram } from '@/utils/diagram.utils';

import { createReducer } from './utils';

const addDiagramReducer = createReducer(Realtime.diagram.crud.add, (state, { versionID, value }) => {
  const version = Normal.getOne(state, versionID);

  if (!version) return;

  if (isTemplateDiagram(value.type)) {
    version.templateDiagramID = value.diagramID;
  }
});

export default addDiagramReducer;
