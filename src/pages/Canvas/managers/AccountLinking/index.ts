import { BlockType, PlatformType } from '@/constants';

import { NodeConfig } from '../types';
import AccountLinkingEditor from './AccountLinkingEditor';
import AccountLinkingStep from './AccountLinkingStep';

const AccountLinkingManager: NodeConfig<{}> = {
  type: BlockType.ACCOUNT_LINKING,
  icon: 'accountLinking',
  iconColor: '#645f5f',
  platforms: [PlatformType.ALEXA],

  label: 'Account Linking',
  tip: 'Account Linking tips',

  step: AccountLinkingStep,
  editor: AccountLinkingEditor,

  factory: (factoryData?) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Account Linking',
      ...factoryData,
    },
  }),
};

export default AccountLinkingManager;
