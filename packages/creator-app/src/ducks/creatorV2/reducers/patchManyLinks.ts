import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createActiveDiagramReducer } from './utils';

const patchManyLinksReducer = createActiveDiagramReducer(Realtime.link.patchMany, (state, { patches }) => {
  patches.forEach(({ linkID, data }) => {
    const link = Normal.getOne(state.links, linkID);

    if (!link) return;

    link.data = { ...link.data, ...data };
  });
});

export default patchManyLinksReducer;
