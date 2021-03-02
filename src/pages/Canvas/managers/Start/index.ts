import { BlockType } from '@/constants';

import { BasicNodeManagerConfig } from '../types';
import StartEditor from './StartEditor';

const StartManager: BasicNodeManagerConfig = {
  type: BlockType.START,
  editor: StartEditor,

  label: 'Start',
};

export default StartManager;
