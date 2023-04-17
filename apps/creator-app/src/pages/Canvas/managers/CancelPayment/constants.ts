import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.CancelPayment, Realtime.NodeData.CancelPaymentBuiltInPorts> = {
  type: BlockType.CANCEL_PAYMENT,
  icon: 'trash',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [],
          builtIn: {
            [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT },
            [BaseModels.PortType.FAIL]: { label: BaseModels.PortType.FAIL },
          },
        },
      },
    },
    data: {
      name: 'Cancel Payment',
      productID: null,
    },
  }),
};
