import * as Platform from '@voiceflow/platform-config';
import type * as Realtime from '@voiceflow/realtime-sdk';

import type { NodeManagerConfig } from '../types';
import AccountLinkingEditor from './AccountLinkingEditor';
import AccountLinkingStep from './AccountLinkingStep';
import { NODE_CONFIG } from './constants';

const AccountLinkingManager: NodeManagerConfig<
  Realtime.NodeData.AccountLinking,
  Realtime.NodeData.AccountLinkingBuiltInPorts
> = {
  ...NODE_CONFIG,

  label: 'Account Linking',
  platforms: [Platform.Constants.PlatformType.ALEXA],

  step: AccountLinkingStep,
  editor: AccountLinkingEditor as any,
};

export default AccountLinkingManager;
