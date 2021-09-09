import * as Realtime from '@voiceflow/realtime-sdk';

import { createCRUDReducers } from '@/ducks/utils/crudV2';

import { createReducer } from './utils';

const crudReducers = createCRUDReducers(createReducer, {
  ...Realtime.workspace.crudActions,
  replace: Realtime.workspace.crudLocalActions.replace as any,
});

export default crudReducers;
