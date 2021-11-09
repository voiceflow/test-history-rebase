import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import ChoiceEditor from './ChoiceEditor';
import ChoiceStep from './ChoiceStep';
import { NODE_CONFIG } from './constants';
import { EDITORS_BY_PATH } from './subeditors';

const ChoiceManager: NodeManagerConfig<Realtime.NodeData.Interaction> = {
  ...NODE_CONFIG,

  tip: 'Select choices and capture slot values from user input',
  label: 'Choice',
  buttons: true,
  reprompt: true,

  step: ChoiceStep,
  editor: ChoiceEditor,
  editorsByPath: EDITORS_BY_PATH,
};

export default ChoiceManager;
