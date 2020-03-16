import { BlockType, PlatformType } from '@/constants';
import UserMinusIcon from '@/svgs/solid/user-minus.svg';

import CancelPaymentEditor from './CancelPaymentEditor';
import CancelPaymentStep from './CancelPaymentStep';

const CancelPaymentManager = {
  type: BlockType.CANCEL_PAYMENT,
  icon: UserMinusIcon,

  label: 'Cancel Payment',
  tip: "Refund a purchase or cancel an user's subscription",

  editor: CancelPaymentEditor,
  step: CancelPaymentStep,

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
      name: 'Cancel Payment',
      productID: null,
    },
  }),
};

export default CancelPaymentManager;
