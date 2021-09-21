import { Constants } from '@voiceflow/general-types';

import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import PermissionEditor from './PermissionEditor';
import PermissionStep from './PermissionStep';

const PermissionManager: NodeManagerConfig<NodeData.Permission> = {
  ...NODE_CONFIG,

  tip: 'Ask users to enable permissions (User Info, Reminders, etc.)',
  label: 'Permissions',
  platforms: [Constants.PlatformType.ALEXA],

  step: PermissionStep,
  editor: PermissionEditor,
};

export default PermissionManager;
