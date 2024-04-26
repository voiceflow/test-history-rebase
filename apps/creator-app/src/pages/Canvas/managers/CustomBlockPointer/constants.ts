import type * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Pointer> = {
  type: BlockType.CUSTOM_BLOCK_POINTER,
  icon: 'customBlock',
  factory: (
    { sourceID = '', name = '', pointedType = BlockType.TRACE, parameters = {}, pointerName = '' } = {},
    options
  ) => {
    const baseCustomBlock = options?.allCustomBlocks?.find(({ id }) => id === sourceID);

    return {
      node: {
        ports: {
          in: [{}],
          out: {
            byKey: {},
            dynamic: baseCustomBlock?.paths.map((pathname) => ({ label: pathname })) ?? [],
            builtIn: {},
          },
        },
      },
      data: {
        name,
        sourceID,
        pointedType,
        parameters,
        pointerName,
      },
    };
  },
};
