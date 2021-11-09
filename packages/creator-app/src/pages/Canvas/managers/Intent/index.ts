import * as Realtime from '@voiceflow/realtime-sdk';

import { SLOT_PATH_TYPE } from '@/components/IntentForm/components/Custom/components';
import IntentSlotForm from '@/components/IntentSlotForm';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import IntentEditor from './IntentEditor';
import IntentStep from './IntentStep';

const EDITORS_BY_PATH = {
  [SLOT_PATH_TYPE]: IntentSlotForm,
};

const IntentManager: NodeManagerConfig<Realtime.NodeData.Intent> = {
  ...NODE_CONFIG,

  tip: 'All your project to handle an intent from anywhere inside your project',
  label: 'Intent',

  step: IntentStep,
  editor: IntentEditor,
  editorsByPath: EDITORS_BY_PATH,
};

export default IntentManager;
