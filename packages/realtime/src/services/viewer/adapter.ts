import * as Realtime from '@voiceflow/realtime-sdk';
import { Hash } from '@voiceflow/socket-utils';
import { createAdapter } from 'bidirectional-adapter';

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
