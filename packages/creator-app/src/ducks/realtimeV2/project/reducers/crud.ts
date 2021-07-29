import * as Realtime from '@voiceflow/realtime-sdk';

import { createCRUDReducers } from '../../utils';
import { createReducer } from './utils';

const crudReducers = createCRUDReducers(createReducer, Realtime.project.crudActions);

export default crudReducers;
