import { BlockType, PlatformType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import PaymentEditor from './PaymentEditor';
import PaymentStep from './PaymentStep';

const PaymentManager: NodeConfig<NodeData.Payment> = {
  type: BlockType.PAYMENT,
  icon: 'purchase',
  iconColor: '#558B2F',
  platforms: [PlatformType.ALEXA],

  label: 'Purchase',
  tip: 'Request payment from user',

  step: PaymentStep,
  editor: PaymentEditor,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, { label: 'fail' }],
      },
    },
    data: {
      name: 'Payment',
      productID: null,
    },
  }),
};

export default PaymentManager;
