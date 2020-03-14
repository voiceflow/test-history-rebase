import { BlockType } from '@/constants';
import CloneIcon from '@/svgs/solid/clone.svg';

import FlowBlock from './FlowBlock';
import FlowEditor from './FlowEditor';
import FlowStep from './FlowStep';

const FlowManager = {
  type: BlockType.FLOW,
  icon: CloneIcon,

  editor: FlowEditor,
  block: FlowBlock,
  step: FlowStep,

  label: 'Flow',
  tip: 'Organize your project into manageable sections or perform computations',

  addable: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Flow',
      diagramID: null,
      inputs: [],
      outputs: [],
    },
  }),
};

export default FlowManager;
