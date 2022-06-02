import * as Realtime from '@voiceflow/realtime-sdk';

import { addLink } from '../utils';
import { createActiveDiagramReducer } from './utils';

const addByKeyLinkReducer = createActiveDiagramReducer(Realtime.link.addByKey, (state, payload) => {
  addLink(state, payload);
});

export default addByKeyLinkReducer;
