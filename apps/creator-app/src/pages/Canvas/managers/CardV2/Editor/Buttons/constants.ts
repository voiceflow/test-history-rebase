import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

export const PATH = 'button/:buttonID' as const;

export const buttonFactory = (): Realtime.NodeData.CardV2.Button => ({
  id: Utils.id.cuid.slug(),
  name: '',
  intent: null,
});
