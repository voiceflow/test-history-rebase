import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const factory = (): BaseNode.CardV2.Card => ({
  id: Utils.id.cuid.slug(),
  title: '',
  description: SlateEditorAPI.getEmptyState(),
  imageUrl: '',
  buttons: [],
});

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts> = {
  type: BlockType.CARDV2,
  icon: 'logs',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: Realtime.Utils.port.createEmptyNodeOutPorts(),
      },
    },
    data: {
      name: 'Card',
      layout: BaseNode.CardV2.CardLayout.CAROUSEL,
      cards: [factory()],
      noMatch: null,
      noReply: null,
    },
  }),
};
