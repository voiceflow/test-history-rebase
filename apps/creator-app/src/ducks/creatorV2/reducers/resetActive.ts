import * as Realtime from '@voiceflow/realtime-sdk';

import { INITIAL_STATE } from '../constants';
import { createReducer } from './utils';

const resetActiveReducer = createReducer(Realtime.creator.resetActive, () => INITIAL_STATE);

export default resetActiveReducer;
