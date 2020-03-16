import IntentSlotForm from '@/components/IntentSlotForm';
import { BlockType } from '@/constants';
import ArrowFromLeftIcon from '@/svgs/solid/arrow-alt-from-left.svg';

import IntentBlock from './IntentBlock';
import IntentEditor from './IntentEditor';
import IntentStep from './IntentStep';

const EDITORS_BY_PATH = {
  slot: IntentSlotForm,
};

const IntentManager = {
  type: BlockType.INTENT,
  icon: ArrowFromLeftIcon,
  block: IntentBlock,

  editorsByPath: EDITORS_BY_PATH,
  editor: IntentEditor,
  step: IntentStep,

  label: 'Intent',
  tip: 'All your project to handle an intent from anywhere inside your project',

  addable: true,
  platformDependent: true,

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
