import { PlatformType } from '@voiceflow/internal';

import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import ButtonsEditor from './ButtonsEditor';
import ButtonsStep from './ButtonsStep';
import { NODE_CONFIG } from './constants';
import { EDITORS_BY_PATH } from './subeditors';

const ButtonsManager: NodeManagerConfig<NodeData.Buttons> = {
  ...NODE_CONFIG,

  label: 'Buttons',
  platforms: [PlatformType.CHATBOT],

  step: ButtonsStep,
  editor: ButtonsEditor,
  editorsByPath: EDITORS_BY_PATH,
};

export default ButtonsManager;
