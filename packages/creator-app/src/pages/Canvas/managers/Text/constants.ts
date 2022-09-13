import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const textFactory = () => ({ id: Utils.id.cuid.slug(), content: SlateEditorAPI.getEmptyState() });

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts> = {
  type: BlockType.TEXT,
  icon: 'systemText',

  factory: (_, options) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [],
          builtIn: { [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT } },
        },
      },
    },
    data: {
      name: 'Text',
      texts: [textFactory()],
      canvasVisibility: options?.canvasNodeVisibility,
    },
  }),
};
