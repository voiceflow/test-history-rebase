import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from '../utils';
import { removeDiagramLocks } from './utils';

const removeDiagram = createReducer(Realtime.diagram.crud.remove, (state, { key }) => removeDiagramLocks(state)(key));

export default removeDiagram;
