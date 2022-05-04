import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { NodeManagerConfig } from '../types';
import AccountLinkingEditor from './AccountLinkingEditor';
import AccountLinkingStep from './AccountLinkingStep';
import { NODE_CONFIG } from './constants';

const AccountLinkingManager: NodeManagerConfig<Realtime.NodeData.AccountLinking, Realtime.NodeData.AccountLinkingBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Account Linking',
  platforms: [VoiceflowConstants.PlatformType.ALEXA],

  step: AccountLinkingStep,
  editor: AccountLinkingEditor,
};

export default AccountLinkingManager;
