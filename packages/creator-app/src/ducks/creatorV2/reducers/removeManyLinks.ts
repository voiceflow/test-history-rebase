import * as Realtime from '@voiceflow/realtime-sdk';

import { removeLink } from '../utils';
import { createActiveDiagramReducer } from './utils';

const removeManyLinksReducer = createActiveDiagramReducer(Realtime.link.removeMany, (state, { linkIDs }) => {
  linkIDs.forEach((linkID) => {
    removeLink(state, linkID);
  });
});

export default removeManyLinksReducer;
