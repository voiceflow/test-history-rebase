import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.CancelPayment> = {
  type: BlockType.CANCEL_PAYMENT,

  icon: 'trash',
  iconColor: '#d94c4c',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, { label: Models.PortType.FAIL }],
      },
    },
    data: {
      name: 'Cancel Payment',
      productID: null,
    },
  }),
};
