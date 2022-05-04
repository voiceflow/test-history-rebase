import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { NodeManagerConfig } from '../types';
import CancelPaymentEditor from './CancelPaymentEditor';
import CancelPaymentStep from './CancelPaymentStep';
import { NODE_CONFIG } from './constants';

const CancelPaymentManager: NodeManagerConfig<Realtime.NodeData.CancelPayment, Realtime.NodeData.CancelPaymentBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Cancel Purchase',
  platforms: [VoiceflowConstants.PlatformType.ALEXA],

  step: CancelPaymentStep,
  editor: CancelPaymentEditor,
};

export default CancelPaymentManager;
