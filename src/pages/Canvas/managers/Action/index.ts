import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import ActionEditor from './ActionEditor';
import ActionStep from './ActionStep';

const TraceManager: NodeManagerConfig<NodeData.Trace> = {
  type: BlockType.TRACE,
  editor: ActionEditor,
  icon: 'action',
  iconColor: '#3A5999',

  step: ActionStep,
  label: 'Custom Action',
  tip: 'mock an example action',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: '',
      body: '',
      paths: [{ label: '', isDefault: true }],
    },
  }),
};

export default TraceManager;
