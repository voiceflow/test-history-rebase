import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const reloadReducer = createReducer(Realtime.intent.reload, (_, { intents }) => Normal.normalize(intents));

export default reloadReducer;
