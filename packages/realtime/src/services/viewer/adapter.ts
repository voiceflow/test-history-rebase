import * as Realtime from '@voiceflow/realtime-sdk';
import { createAdapter } from 'bidirectional-adapter';

import { Hash } from '../../clients/cache/types';

// eslint-disable-next-line import/prefer-default-export
export const viewerAdapter = createAdapter<Hash, Realtime.Viewer>(
  (hash) => ({
    ...(hash as Omit<Realtime.Viewer, 'creatorID'>),
    creatorID: Number(hash.creatorID),
  }),
  (viewer) => ({
    ...viewer,
    creatorID: String(viewer.creatorID),
  })
);
