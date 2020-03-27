import { BlockType, PlatformType } from '@/constants';

import AccountLinkingEditor from './AccountLinkingEditor';
import AccountLinkingStep from './AccountLinkingStep';

const AccountLinkingManager = {
  type: BlockType.ACCOUNT_LINKING,
  editor: AccountLinkingEditor,
  icon: 'accountLinking',
  iconColor: '#645f5f',
  step: AccountLinkingStep,
  label: 'Account Linking',
  tip: 'Account Linking tips',

  addable: true,
  platforms: [PlatformType.ALEXA],

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Account Linking',
    },
  }),
};

export default AccountLinkingManager;
