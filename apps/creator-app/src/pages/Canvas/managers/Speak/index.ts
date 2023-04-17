import { SLOT_REGEXP } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeCategory } from '@/contexts/SearchContext/types';

import { NodeManagerConfigV2 } from '../types';
import { Editor, Step } from './components';
import { getLabelByType, NODE_CONFIG } from './constants';

const SpeakManager: NodeManagerConfigV2<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Speak',
  getDataLabel: (data) => getLabelByType(data.dialogs[0]?.type),

  step: Step,
  editorV2: Editor,

  searchCategory: NodeCategory.RESPONSES,
  getSearchParams: (data) => data.dialogs.map((dialog) => (Realtime.isSSML(dialog) ? dialog.content : dialog.url).replace(SLOT_REGEXP, '{$1}')),
};

export default SpeakManager;
