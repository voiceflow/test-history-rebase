import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import PaymentEditor from './PaymentEditor';
import PaymentStep from './PaymentStep';

const PaymentManager: NodeManagerConfig<Realtime.NodeData.Payment, Realtime.NodeData.PaymentBuiltInPorts> = {
  ...NODE_CONFIG,

  tip: 'Request payment from user',
  label: 'Purchase',
  platforms: [VoiceflowConstants.PlatformType.ALEXA],

  step: PaymentStep,
  editor: PaymentEditor,
};

export default PaymentManager;
