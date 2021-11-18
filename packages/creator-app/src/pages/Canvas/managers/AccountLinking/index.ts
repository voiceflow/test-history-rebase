import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import AccountLinkingEditor from './AccountLinkingEditor';
import AccountLinkingStep from './AccountLinkingStep';
import { NODE_CONFIG } from './constants';

const AccountLinkingManager: NodeManagerConfig<Realtime.NodeData.AccountLinking, Realtime.NodeData.AccountLinkingBuiltInPorts> = {
  ...NODE_CONFIG,

  tip: 'Account Linking tips',
  label: 'Account Linking',
  platforms: [Constants.PlatformType.ALEXA],

  step: AccountLinkingStep,
  editor: AccountLinkingEditor,
};

export default AccountLinkingManager;
