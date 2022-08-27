import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';
import { removeDiagramLocks } from './utils';

const removeManyDiagrams = createReducer(Realtime.diagram.crud.removeMany, (state, { keys }) => keys.forEach(removeDiagramLocks(state)));

export default removeManyDiagrams;
