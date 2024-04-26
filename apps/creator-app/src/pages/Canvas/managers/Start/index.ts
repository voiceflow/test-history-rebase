import type * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { BaseNodeManagerConfig } from '../types';
import { Chip, Editor } from './components';

const StartManager: BaseNodeManagerConfig<Realtime.NodeData.Start> = {
  label: 'Start',

  type: BlockType.START,
  chip: Chip,
  editorV2: Editor,
};

export default StartManager;
