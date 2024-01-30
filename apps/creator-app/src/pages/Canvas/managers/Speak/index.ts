import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeCategory } from '@/contexts/SearchContext/types';
import { Diagram } from '@/ducks';

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
  getSearchParams: (data, state) =>
    data.dialogs.map(
      (dialog) => Realtime.Utils.slot.transformVariablesToReadable(Realtime.isSSML(dialog) ? dialog.content : dialog.url),
      Diagram.active.entitiesAndVariablesMapSelector(state)
    ),
};

export default SpeakManager;
