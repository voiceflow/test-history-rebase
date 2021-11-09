import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { BasicNodeManagerConfig } from '../types';
import { EDITORS_BY_PATH } from './constants';
import StartEditor from './StartEditor';

const StartManager: BasicNodeManagerConfig<Realtime.NodeData.Start> = {
  type: BlockType.START,
  editor: StartEditor,
  editorsByPath: EDITORS_BY_PATH,

  label: 'Start',
};

export default StartManager;
