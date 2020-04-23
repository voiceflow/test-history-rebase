import IntentSlotForm from '@/components/IntentSlotForm';
import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import IntentEditor from './IntentEditor';
import IntentStep from './IntentStep';

const EDITORS_BY_PATH = {
  slot: IntentSlotForm,
};

const IntentManager: NodeConfig<NodeData.Intent> = {
  type: BlockType.INTENT,
  icon: 'user',
  iconColor: '#5589eb',
  addable: true,
  platformDependent: true,

  label: 'Intent',
  tip: 'All your project to handle an intent from anywhere inside your project',

  step: IntentStep,
  editor: IntentEditor,
  editorsByPath: EDITORS_BY_PATH,

  factory: () => ({
    node: {
      ports: {
        out: [{}],
      },
    },
    data: {
      name: 'Intent',
      alexa: { intent: null, mappings: [] },
      google: { intent: null, mappings: [] },
    },
  }),
};

export default IntentManager;
