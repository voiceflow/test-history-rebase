import cuid from 'cuid';

import { BlockType, PlatformType } from '@/constants';

import UserInfoEditor from './UserInfoEditor';
import UserInfoStep from './UserInfoStep';

const UserInfoManager = {
  type: BlockType.USER_INFO,
  icon: 'user',

  editor: UserInfoEditor,
  step: UserInfoStep,

  label: 'User Info',
  tip: 'Get User Information and check Permissions',

  addable: true,
  platforms: [PlatformType.ALEXA],

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, { label: 'fail' }],
      },
    },
    data: {
      name: 'User Info',
      permissions: [
        {
          id: cuid.slug(),
          selected: null,
        },
      ],
    },
  }),
};

export default UserInfoManager;
