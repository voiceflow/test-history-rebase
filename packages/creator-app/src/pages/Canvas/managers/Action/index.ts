import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';
import { BlockType } from '@/constants';
import { NodeCategory } from '@/contexts/SearchContext/types';

import { NodeManagerConfig } from '../types';
import ActionEditor from './ActionEditor';
import ConnectedActionStep from './ActionStep';

const TraceManager: NodeManagerConfig<Realtime.NodeData.Trace> = {
  type: BlockType.TRACE,
  editor: ActionEditor,
  icon: 'customAction',

  step: ConnectedActionStep,
  label: 'Custom Action',

  searchCategory: NodeCategory.BLOCK,
  getSearchParams: (data) => [data.name],

  tooltipText: 'Pairs with the Voiceflow Dialog Manager SDK to create custom actions.',
  tooltipLink: Documentation.CUSTOM_ACTION,

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
