import { BlockType } from '@/constants';
import CloneIcon from '@/svgs/solid/clone.svg';

import FlowBlock from './FlowBlock';
import FlowEditor from './FlowEditor';

const FlowManager = {
  type: BlockType.FLOW,
  editor: FlowEditor,
  block: FlowBlock,
  icon: CloneIcon,

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
