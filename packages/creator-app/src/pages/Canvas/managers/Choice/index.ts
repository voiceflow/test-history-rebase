import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import ChoiceEditor from './ChoiceEditor';
import ChoiceStep from './ChoiceStep';
import { NODE_CONFIG } from './constants';
import { EDITORS_BY_PATH } from './subeditors';

const ChoiceManager: NodeManagerConfig<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Choice',

  step: ChoiceStep,
  editor: ChoiceEditor,
  editorsByPath: EDITORS_BY_PATH,
};

export default ChoiceManager;
