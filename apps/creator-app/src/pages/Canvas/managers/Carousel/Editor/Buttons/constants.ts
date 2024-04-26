import { Utils } from '@voiceflow/common';
import type * as Realtime from '@voiceflow/realtime-sdk';

export const PATH = 'button/:buttonID' as const;

export const buttonFactory = (): Realtime.NodeData.Carousel.Button => ({
  id: Utils.id.cuid.slug(),
  name: '',
  intent: null,
});
