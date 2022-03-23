import * as Realtime from '@voiceflow/realtime-sdk';

import { removeLink } from '../utils';
import { createActiveDiagramReducer } from './utils';

const removeManyLinksReducer = createActiveDiagramReducer(Realtime.link.removeMany, (state, { links }) => {
  links.forEach((link) => {
    removeLink(state, link.linkID);
  });
});

export default removeManyLinksReducer;
