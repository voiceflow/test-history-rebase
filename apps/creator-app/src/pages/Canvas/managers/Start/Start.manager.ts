import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { BaseNodeManagerConfig } from '../types';
import { Editor } from './components';
import { StartChip } from './Start.chip';
import { StartEditor } from './StartEditor/Start.editor';

export const StartManager: BaseNodeManagerConfig<Realtime.NodeData.Start> = {
  label: 'Start',

  type: BlockType.START,
  chip: StartChip,
  editorV2: Editor,
  editorV3: StartEditor,
  editorV3FeaturFlag: Realtime.FeatureFlag.TRIGGER_STEP,
};
