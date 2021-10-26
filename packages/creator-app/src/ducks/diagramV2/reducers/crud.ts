import * as Realtime from '@voiceflow/realtime-sdk';

import { createCRUDReducers } from '@/ducks/utils/crudV2';

import { createReducer } from './utils';

const crudReducers = createCRUDReducers(createReducer as any, Realtime.diagram.crud);

export default crudReducers;
