import { BlockType } from '@/constants';

import { BasicNodeConfig } from '../types';
import StartEditor from './StartEditor';

const StartManager: BasicNodeConfig = {
  type: BlockType.START,
  editor: StartEditor,

  label: 'Start',
};

export default StartManager;
