import * as Platform from '@voiceflow/platform-config';
import type * as Realtime from '@voiceflow/realtime-sdk';

import type { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import PermissionEditor from './PermissionEditor';
import PermissionStep from './PermissionStep';

const PermissionManager: NodeManagerConfig<Realtime.NodeData.Permission, Realtime.NodeData.PermissionBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Permissions',
  platforms: [Platform.Constants.PlatformType.ALEXA],

  step: PermissionStep,
  editor: PermissionEditor,
};

export default PermissionManager;
