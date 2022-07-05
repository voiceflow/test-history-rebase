import * as Realtime from '@voiceflow/realtime-sdk';
import { SVG } from '@voiceflow/ui';

import { BlockType, INTEGRATION_STEPS_LINK } from '@/constants';

import { NodeManagerConfig } from '../types';
import ActionEditor from './ActionEditor';
import ConnectedActionStep from './ActionStep';

const TraceManager: NodeManagerConfig<Realtime.NodeData.Trace> = {
  type: BlockType.TRACE,
  editor: ActionEditor,
  icon: 'action',

  step: ConnectedActionStep,
  label: 'Custom Action',

  stepsMenuIcon: SVG.systemIntegrations,
  tooltipText: 'Add custom actions to your assistant.',
  tooltipLink: INTEGRATION_STEPS_LINK,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          builtIn: {},
          dynamic: [{}],
        },
      },
    },
    data: {
      name: '',
      body: '',
      paths: [{ label: '', isDefault: true }],
      isBlocking: false,
    },
  }),
};

export default TraceManager;
