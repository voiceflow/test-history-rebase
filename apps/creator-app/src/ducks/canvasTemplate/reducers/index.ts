import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import createTemplateDiagramDone from './createTemplateDiagramDone';
import crudReducers from './crud';
import importSnapshot, { importSnapshotReverter } from './importSnapshot';
import initialize from './initialize';
import reset from './reset';

const canvasTemplateReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .mimerCase(...initialize)
  .mimerCase(...importSnapshot)
  .mimerCase(...createTemplateDiagramDone)
  .mimerCase(...reset)
  .build();

export default canvasTemplateReducer;

export const reverters = [importSnapshotReverter];
