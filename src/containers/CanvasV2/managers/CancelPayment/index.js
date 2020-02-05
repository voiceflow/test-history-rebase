import { BlockType, PlatformType } from '@/constants';
import UserMinusIcon from '@/svgs/solid/user-minus.svg';

import CancelPaymentEditor from './CancelPaymentEditor';

const CancelPaymentManager = {
  type: BlockType.CANCEL_PAYMENT,
  editor: CancelPaymentEditor,
  icon: UserMinusIcon,

  label: 'Cancel Payment',
  tip: "Refund a purchase or cancel an user's subscription",

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
