import type * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

export const pointerNodeDataFactory = (customBlock: Realtime.CustomBlock): Realtime.NodeData.Pointer => ({
  sourceID: customBlock.id,
  parameters: Object.fromEntries(customBlock.parameters.map((key) => [key, ''])),
  pointerName: customBlock.name,
  pointedType: BlockType.TRACE,
});
