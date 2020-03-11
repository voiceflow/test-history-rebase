import { BlockType } from '@/constants';

import StartEditor from './StartEditor';

const StartManager = {
  type: BlockType.START,
  editor: StartEditor,

  label: 'Start',
};

export default StartManager;
