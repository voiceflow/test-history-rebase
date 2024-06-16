import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { BaseNodeManagerConfig } from '../types';
import { StartChip } from './Start.chip';
import { StartEditor } from './StartEditor/Start.editor';

export const StartManager: BaseNodeManagerConfig<Realtime.NodeData.Start> = {
  label: 'Start',

  type: BlockType.START,
  chip: StartChip,
  editorV3: StartEditor,
};
