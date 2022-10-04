import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const reloadReducer = createReducer(Realtime.nlu.reload, (_, { nluUnclassifiedData }) => Normal.normalize(nluUnclassifiedData));

export default reloadReducer;
