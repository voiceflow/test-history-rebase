import * as Realtime from '@voiceflow/realtime-sdk';

import { INITIAL_STATE } from '../constants';
import { createReducer } from './utils';

const resetReducer = createReducer(Realtime.creator.reset, () => INITIAL_STATE);

export default resetReducer;
