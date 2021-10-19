import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { BasicNodeManagerConfig } from '../types';
import { EDITORS_BY_PATH } from './constants';
import StartEditor from './StartEditor';

const StartManager: BasicNodeManagerConfig<NodeData.Start> = {
  type: BlockType.START,
  editor: StartEditor,
  editorsByPath: EDITORS_BY_PATH,

  label: 'Start',
};

export default StartManager;
