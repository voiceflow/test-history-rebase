import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import PermissionEditor from './PermissionEditor';
import PermissionStep from './PermissionStep';

const PermissionManager: NodeManagerConfig<Realtime.NodeData.Permission, Realtime.NodeData.PermissionBuiltInPorts> = {
  ...NODE_CONFIG,

  tip: 'Ask users to enable permissions (User Info, Reminders, etc.)',
  label: 'Permissions',
  platforms: [Constants.PlatformType.ALEXA],

  step: PermissionStep,
  editor: PermissionEditor,
};

export default PermissionManager;
