import { Utils } from '@voiceflow/common';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.Text> = {
  type: BlockType.TEXT,

  icon: 'textStep',
  iconColor: '#74a4bf',

  factory: (_, options) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Text',
      texts: [{ id: Utils.id.cuid.slug(), content: SlateEditorAPI.getEmptyState() }],
      canvasVisibility: options?.canvasNodeVisibility,
    },
  }),
};
