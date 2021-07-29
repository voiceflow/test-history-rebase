import * as Realtime from '@voiceflow/realtime-sdk';

import { createCRUDReducers } from '../../utils';
import { createReducer } from './utils';

const crudReducers = createCRUDReducers(createReducer, {
  ...Realtime.workspace.crudActions,
  replace: Realtime.workspace.crudLocalActions.replace as any,
});

export default crudReducers;
