import * as Realtime from '@voiceflow/realtime-sdk';

import { INITIAL_STATE } from '../constants';
import { createReducer } from './utils';

const resetReducer = createReducer<any>([Realtime.creator.reset, Realtime.creator.initialize], () => INITIAL_STATE);

export default resetReducer;
