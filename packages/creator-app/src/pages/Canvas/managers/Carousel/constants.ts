import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const cardFactory = (): BaseNode.Carousel.CarouselCard => ({
  id: Utils.id.cuid.slug(),
  title: '',
  description: SlateEditorAPI.getEmptyState(),
  imageUrl: '',
  buttons: [],
});

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Carousel, Realtime.NodeData.CarouselBuiltInPorts> = {
  type: BlockType.CAROUSEL,
  icon: 'systemCarousel',
  isMergeTerminator: ({ data }) => Realtime.Utils.typeGuards.isCarouselNodeData(data) && Boolean(data.noMatch || data.noReply),

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
      layout: BaseNode.Carousel.CarouselLayout.CAROUSEL,
      cards: [cardFactory()],
      noMatch: null,
      noReply: null,
    },
  }),
};
