import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const reloadReducer = createReducer(Realtime.slot.reload, (_, { slots }) => Normal.normalize(slots));

export default reloadReducer;
