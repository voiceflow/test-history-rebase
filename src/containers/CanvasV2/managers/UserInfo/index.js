import cuid from 'cuid';

import { BlockType, PlatformType } from '@/constants';

import UserInfoEditor from './UserInfoEditor';

const UserInfoManager = {
  type: BlockType.USER_INFO,
  editor: UserInfoEditor,
  icon: 'user',

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
