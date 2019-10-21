import { BlockType } from '@/constants';
import ArrowFromLeftIcon from '@/svgs/solid/arrow-alt-from-left.svg';

import IntentBlock from './IntentBlock';
import IntentEditor from './IntentEditor';

const IntentManager = {
  type: BlockType.INTENT,
  block: IntentBlock,
  editor: IntentEditor,
  icon: ArrowFromLeftIcon,

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
