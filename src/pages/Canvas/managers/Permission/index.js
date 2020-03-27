import { BlockType, PlatformType } from '@/constants';

import PermissionEditor from './PermissionEditor';
import PermissionStep from './PermissionStep';

const PermissionManager = {
  type: BlockType.PERMISSION,
  icon: 'openLock',
  iconColor: '#6e849a',

  editor: PermissionEditor,
  step: PermissionStep,

  label: 'Permission',
  tip: 'Ask users to enable permissions (User Info, Reminders, etc.)',

  addable: true,
  platforms: [PlatformType.ALEXA],

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
