import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

export const makeFactoryData = (customBlock: Realtime.CustomBlock) => {
  return {
    sourceID: customBlock.id,
    pointerName: customBlock.name,
    pointedType: BlockType.TRACE,
    parameters: Object.fromEntries(customBlock.parameters.map((key) => [key, ''])),
  };
};
