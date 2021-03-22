import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import TraceEditor from './TraceEditor';
import TraceStep from './TraceStep';

const TraceManager: NodeManagerConfig<NodeData.Trace> = {
  type: BlockType.TRACE,
  editor: TraceEditor,
  icon: 'search',
  iconColor: '#3A5999',

  step: TraceStep,
  label: 'Trace',
  tip: 'output a custom trace',

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
