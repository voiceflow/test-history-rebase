import { BlockType, PlatformType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import PermissionEditor from './PermissionEditor';
import PermissionStep from './PermissionStep';

const PermissionManager: NodeConfig<NodeData.Permission> = {
  type: BlockType.PERMISSION,
  icon: 'openLock',
  iconColor: '#6e849a',
  addable: true,
  platforms: [PlatformType.ALEXA],

  label: 'Permission',
  labelV2: 'Permissions',
  tip: 'Ask users to enable permissions (User Info, Reminders, etc.)',

  step: PermissionStep,
  editor: PermissionEditor,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Permission',
      permissions: [],
      custom: false,
    },
  }),
};

export default PermissionManager;
