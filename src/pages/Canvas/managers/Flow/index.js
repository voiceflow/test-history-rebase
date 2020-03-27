import { BlockType } from '@/constants';

import FlowBlock from './FlowBlock';
import FlowEditor from './FlowEditor';
import FlowStep from './FlowStep';

const FlowManager = {
  type: BlockType.FLOW,
  icon: 'flow',
  iconColor: '#3c6997',

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
