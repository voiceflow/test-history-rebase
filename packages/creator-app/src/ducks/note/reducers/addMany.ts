import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const addManyReducer = createReducer(Realtime.note.addMany, (state, { values }) => Normal.appendMany(state, values));

export default addManyReducer;
