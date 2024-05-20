import { NodeSystemPortType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { NodeConfig } from '../types';

export const TRIGGER_NODE_CONFIG: NodeConfig<Realtime.NodeData.Trigger> = {
  type: BlockType.TRIGGER,
  icon: 'intent',

  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: { ...Realtime.Utils.port.createEmptyNodeOutPorts(), byKey: { [NodeSystemPortType.NEXT]: { label: NodeSystemPortType.NEXT } } },
      },
    },
    data: { name: '', items: [] },
  }),
};
