import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';
import { BlockType } from '@/constants';
import { NodeCategory } from '@/contexts/SearchContext/types';

import type { NodeManagerConfigV2 } from '../types';
import { Editor, Step } from './components';

const TraceManager: NodeManagerConfigV2<Realtime.NodeData.Trace> = {
  type: BlockType.TRACE,
  icon: 'customAction',
  editorV2: Editor,

  step: Step,
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
      bodyType: Realtime.NodeData.TraceBodyType.JSON,
      scope: Realtime.NodeData.TraceScope.LOCAL,
      paths: [{ label: '', isDefault: true }],
      isBlocking: false,
    },
  }),
};

export default TraceManager;
