import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import PermissionEditor from './PermissionEditor';
import PermissionStep from './PermissionStep';

const PermissionManager: NodeManagerConfig<Realtime.NodeData.Permission, Realtime.NodeData.PermissionBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Permissions',
  platforms: [VoiceflowConstants.PlatformType.ALEXA],

  step: PermissionStep,
  editor: PermissionEditor,
};

export default PermissionManager;
