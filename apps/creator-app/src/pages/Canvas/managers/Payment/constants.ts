import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const UPSELL_REQUIREMENTS =
  'Upsell Message - a product suggestion that fits the current user context. It should always end with an explicit (Yes/No) confirmation question.';

export const DOS = [
  'Determine whether a customer is interested in your product',
  'Offer relevant products to the customer',
  'Summarize what the product will provide to the customer',
  'End with an explicit confirmation (Yes/No) statement',
];

export const DONTS = [
  "Don't inclued pricing details, this is handled by Amazon",
  "Don't offer a sales pitch",
  'Never interrupt the customer',
  'Avoid offering multiple prodcts at the same time',
  "Don't keep suggesting the same product, it will feel like an interruption to the customer",
];

export const WARNING =
  'Be careful not to reference the price, subscription term, or free trial length in any of the skill content. Amazon handles the voice interaction model and all the mechanics of the purchase, as well as obtaining the product description and price.';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Payment, Realtime.NodeData.PaymentBuiltInPorts> = {
  type: BlockType.PAYMENT,
  icon: 'purchase',

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
      name: 'Payment',
      productID: null,
    },
  }),
};
