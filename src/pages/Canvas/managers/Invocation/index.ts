import { BlockType } from '@/constants';

import { BasicNodeConfig } from '../types';
import InvocationEditor from './InvocationEditor';
import InvocationStep from './InvocationStep';

const InvocationManager: BasicNodeConfig = {
  type: BlockType.INVOCATION,
  icon: 'exit',
  iconColor: '#369f52',
  mergeTerminator: true,

  label: 'Invocation',

  step: InvocationStep,
  editor: InvocationEditor,
};

export default InvocationManager;
