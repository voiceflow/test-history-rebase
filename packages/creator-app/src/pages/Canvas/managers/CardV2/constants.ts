import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const cardFactory = (): BaseNode.CardV2.CardV2Card => ({
  id: Utils.id.cuid.slug(),
  title: '',
  description: SlateEditorAPI.getEmptyState(),
  imageUrl: '',
  buttons: [],
});

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts> = {
  type: BlockType.CARDV2,
  icon: 'cardV2',
  isMergeTerminator: ({ data }) => Realtime.Utils.typeGuards.isCardV2NodeData(data) && Boolean(data.noMatch || data.noReply),

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          ...Realtime.Utils.port.createEmptyNodeOutPorts(),
          builtIn: {
            [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT },
            [BaseModels.PortType.NO_MATCH]: { label: BaseModels.PortType.NO_MATCH },
          },
        },
      },
    },
    data: {
      name: 'Card',
      card: cardFactory(),
      noMatch: null,
      noReply: null,
    },
  }),
};
