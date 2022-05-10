import * as Realtime from '@voiceflow/realtime-sdk';

import { addLink } from '../utils';
import { createActiveDiagramReducer } from './utils';

const addDynamicLinkReducer = createActiveDiagramReducer(Realtime.link.addDynamic, (state, payload) => {
  addLink(state, payload);
});

export default addDynamicLinkReducer;
