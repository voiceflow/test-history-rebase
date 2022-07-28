import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { BaseNodeManagerConfig } from '../types';
import { Chip } from './components';
import { EDITORS_BY_PATH } from './constants';
import StartEditor from './StartEditor';

const StartManager: BaseNodeManagerConfig<Realtime.NodeData.Start> = {
  label: 'Start',

  type: BlockType.START,
  chip: Chip,
  editor: StartEditor,
  editorsByPath: EDITORS_BY_PATH,
};

export default StartManager;
