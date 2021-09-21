import { Constants } from '@voiceflow/general-types';

import { NodeManagerConfig } from '../types';
import AccountLinkingEditor from './AccountLinkingEditor';
import AccountLinkingStep from './AccountLinkingStep';
import { NODE_CONFIG } from './constants';

const AccountLinkingManager: NodeManagerConfig<{}> = {
  ...NODE_CONFIG,

  tip: 'Account Linking tips',
  label: 'Account Linking',
  platforms: [Constants.PlatformType.ALEXA],

  step: AccountLinkingStep,
  editor: AccountLinkingEditor,
};

export default AccountLinkingManager;
