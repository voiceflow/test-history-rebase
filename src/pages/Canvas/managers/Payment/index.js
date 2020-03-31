import { BlockType, PlatformType } from '@/constants';

import PaymentEditor from './PaymentEditor';
import PaymentStep from './PaymentStep';

const PaymentManager = {
  type: BlockType.PAYMENT,
  icon: 'purchase',
  iconColor: '#558B2F',

  label: 'Payment',
  labelV2: 'Purchase',
  tip: 'Request payment from user',

  editor: PaymentEditor,
  step: PaymentStep,

  addable: true,
  platforms: [PlatformType.ALEXA],

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
