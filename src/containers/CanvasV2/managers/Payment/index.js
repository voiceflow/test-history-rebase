import { BlockType, PlatformType } from '@/constants';

import PaymentEditor from './PaymentEditor';

const PaymentManager = {
  type: BlockType.PAYMENT,
  editor: PaymentEditor,
  icon: 'dollar',

  label: 'Payment',
  tip: 'Request payment from user',

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
