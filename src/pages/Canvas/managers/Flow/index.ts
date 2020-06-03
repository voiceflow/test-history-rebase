import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';
import FlowEditor from './FlowEditor';
import FlowStep from './FlowStep';

const FlowManager: NodeConfig<NodeData.Flow> = {
  type: BlockType.FLOW,
  icon: 'flow',
  iconColor: '#3c6997',

  label: 'Flow',
  tip: 'Organize your project into manageable sections or perform computations',

  step: FlowStep,
  editor: FlowEditor,

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
