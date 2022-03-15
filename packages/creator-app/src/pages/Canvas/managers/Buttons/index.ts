import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { NodeManagerConfig } from '../types';
import ButtonsEditor from './ButtonsEditor';
import ButtonsStep from './ButtonsStep';
import { NODE_CONFIG } from './constants';
import { EDITORS_BY_PATH } from './subeditors';

const ButtonsManager: NodeManagerConfig<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Buttons',
  projectTypes: [VoiceflowConstants.ProjectType.CHAT],

  step: ButtonsStep,
  editor: ButtonsEditor,
  editorsByPath: EDITORS_BY_PATH,
};

export default ButtonsManager;
