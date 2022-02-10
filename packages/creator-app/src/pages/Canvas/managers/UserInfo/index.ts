import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import UserInfoEditor from './UserInfoEditor';
import UserInfoStep from './UserInfoStep';

const UserInfoManager: NodeManagerConfig<Realtime.NodeData.UserInfo, Realtime.NodeData.UserInfoBuiltInPorts> = {
  ...NODE_CONFIG,

  tip: 'Get User Information and check Permissions',
  label: 'User Info',
  platforms: [VoiceflowConstants.PlatformType.ALEXA],

  step: UserInfoStep,
  editor: UserInfoEditor,
};

export default UserInfoManager;
