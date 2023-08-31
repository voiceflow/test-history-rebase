import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { updateUnreadTranscripts } from '../actions';
import { INITIAL_STATE } from '../constants';
import crudReducers from './crud';

const reportTagReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .case(updateUnreadTranscripts, (state, payload) => ({ ...state, hasUnreadTranscripts: payload }))
  .case(Realtime.transcript.crud.remove, (state, payload) => Normal.removeOne(state, payload.key))
  .build();

export default reportTagReducer;
