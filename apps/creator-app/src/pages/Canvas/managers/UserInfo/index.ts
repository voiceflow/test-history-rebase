import * as Platform from '@voiceflow/platform-config';
import type * as Realtime from '@voiceflow/realtime-sdk';

import type { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import UserInfoEditor from './UserInfoEditor';
import UserInfoStep from './UserInfoStep';

const UserInfoManager: NodeManagerConfig<Realtime.NodeData.UserInfo, Realtime.NodeData.UserInfoBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'User Info',
  platforms: [Platform.Constants.PlatformType.ALEXA],

  step: UserInfoStep,
  editor: UserInfoEditor,
};

export default UserInfoManager;
