import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import PaymentEditor from './PaymentEditor';
import PaymentStep from './PaymentStep';

const PaymentManager: NodeManagerConfig<Realtime.NodeData.Payment, Realtime.NodeData.PaymentBuiltInPorts> = {
  ...NODE_CONFIG,

  tip: 'Request payment from user',
  label: 'Purchase',
  platforms: [Constants.PlatformType.ALEXA],

  step: PaymentStep,
  editor: PaymentEditor,
};

export default PaymentManager;
