import { BlockType, PlatformType } from '@/constants';
import LockIcon from '@/svgs/solid/lock.svg';

import PermissionEditor from './PermissionEditor';

const PermissionManager = {
  type: BlockType.PERMISSION,
  editor: PermissionEditor,
  icon: LockIcon,

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
