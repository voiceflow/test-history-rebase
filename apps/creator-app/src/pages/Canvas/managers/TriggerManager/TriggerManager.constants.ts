import { NodeSystemPortType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { NodeConfigWithoutInPorts } from '../types';

export const TRIGGER_NODE_CONFIG: NodeConfigWithoutInPorts<Realtime.NodeData.Trigger> = {
  type: BlockType.TRIGGER,
  icon: 'intentSmall',

  mergeInitializer: true,

  factory: () => ({
    node: {
      ports: {
        out: {
          ...Realtime.Utils.port.createEmptyNodeOutPorts(),
          byKey: { [NodeSystemPortType.NEXT]: { label: NodeSystemPortType.NEXT } },
        },
      },
    },
    data: { name: '', items: [] },
  }),
};
