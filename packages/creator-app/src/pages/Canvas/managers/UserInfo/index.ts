import { PlatformType } from '@voiceflow/internal';

import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import UserInfoEditor from './UserInfoEditor';
import UserInfoStep from './UserInfoStep';

const UserInfoManager: NodeManagerConfig<NodeData.UserInfo> = {
  ...NODE_CONFIG,

  tip: 'Get User Information and check Permissions',
  label: 'User Info',
  platforms: [PlatformType.ALEXA],

  step: UserInfoStep,
  editor: UserInfoEditor,
};

export default UserInfoManager;
