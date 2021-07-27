import { PlatformType } from '@voiceflow/internal';

import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import CancelPaymentEditor from './CancelPaymentEditor';
import CancelPaymentStep from './CancelPaymentStep';
import { NODE_CONFIG } from './constants';

const CancelPaymentManager: NodeManagerConfig<NodeData.CancelPayment> = {
  ...NODE_CONFIG,

  tip: "Refund a purchase or cancel an user's subscription",
  label: 'Cancel Purchase',
  platforms: [PlatformType.ALEXA],

  step: CancelPaymentStep,
  editor: CancelPaymentEditor,
};

export default CancelPaymentManager;
