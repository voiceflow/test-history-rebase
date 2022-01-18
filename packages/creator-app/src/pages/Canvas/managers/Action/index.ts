import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeManagerConfig } from '../types';
import ActionEditor from './ActionEditor';
import ConnectedActionStep from './ActionStep';

const TraceManager: NodeManagerConfig<Realtime.NodeData.Trace> = {
  type: BlockType.TRACE,
  editor: ActionEditor,
  icon: 'action',

  step: ConnectedActionStep,
  label: 'Custom Action',
  tip: 'mock an example action',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          builtIn: {},
          dynamic: [{}],
        },
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
