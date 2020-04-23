import cuid from 'cuid';

import { BlockType, PlatformType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import UserInfoEditor from './UserInfoEditor';
import UserInfoStep from './UserInfoStep';

const UserInfoManager: NodeConfig<NodeData.UserInfo> = {
  type: BlockType.USER_INFO,
  icon: 'barGraph',
  iconColor: '#3C6997',
  addable: true,
  platforms: [PlatformType.ALEXA],

  label: 'User Info',
  tip: 'Get User Information and check Permissions',

  step: UserInfoStep,
  editor: UserInfoEditor,

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
          mapTo: null,
          product: null,
        },
      ],
    },
  }),
};

export default UserInfoManager;
