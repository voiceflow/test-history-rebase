import { BlockType, PlatformType } from '@/constants';
import LinkIcon from '@/svgs/solid/link.svg';

import AccountLinkingEditor from './AccountLinkingEditor';

const AccountLinkingManager = {
  type: BlockType.ACCOUNT_LINKING,
  editor: AccountLinkingEditor,
  icon: LinkIcon,

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
