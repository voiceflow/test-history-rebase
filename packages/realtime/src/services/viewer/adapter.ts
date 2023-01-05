import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Hash } from '@voiceflow/socket-utils';
import { createMultiAdapter } from 'bidirectional-adapter';

export const viewerAdapter = createMultiAdapter<Hash, Realtime.Viewer>(
  (hash) => ({
    ...(hash as Omit<Realtime.Viewer, 'creatorID'>),
    creatorID: Number(hash.creatorID),
  }),
  (viewer) => ({
    ...viewer,
    creatorID: String(viewer.creatorID),
  })
);
