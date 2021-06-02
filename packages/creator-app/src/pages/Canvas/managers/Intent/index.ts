import IntentSlotForm from '@/components/IntentSlotForm';
import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import IntentEditor from './IntentEditor';
import IntentStep from './IntentStep';

const EDITORS_BY_PATH = {
  slot: IntentSlotForm,
};

const IntentManager: NodeManagerConfig<NodeData.Intent> = {
  ...NODE_CONFIG,

  tip: 'All your project to handle an intent from anywhere inside your project',
  label: 'Intent',

  step: IntentStep,
  editor: IntentEditor,
  editorsByPath: EDITORS_BY_PATH,
};

export default IntentManager;
