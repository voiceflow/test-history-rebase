import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts> = {
  type: BlockType.TEXT,
  icon: 'textStep',

  factory: (_, options) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          dynamic: [],
          builtIn: { [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT } },
        },
      },
    },
    data: {
      name: 'Text',
      texts: [{ id: Utils.id.cuid.slug(), content: SlateEditorAPI.getEmptyState() }],
      canvasVisibility: options?.canvasNodeVisibility,
    },
  }),
};
