import * as Realtime from '@voiceflow/realtime-sdk';

import { addLink } from '../utils';
import { createActiveDiagramReducer } from './utils';

const addBuiltinLinkReducer = createActiveDiagramReducer(Realtime.link.addBuiltin, (state, payload) => {
  addLink(state, payload);
});

export default addBuiltinLinkReducer;
