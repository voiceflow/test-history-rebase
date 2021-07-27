import { PlatformType } from '@voiceflow/internal';

import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import PaymentEditor from './PaymentEditor';
import PaymentStep from './PaymentStep';

const PaymentManager: NodeManagerConfig<NodeData.Payment> = {
  ...NODE_CONFIG,

  tip: 'Request payment from user',
  label: 'Purchase',
  platforms: [PlatformType.ALEXA],

  step: PaymentStep,
  editor: PaymentEditor,
};

export default PaymentManager;
