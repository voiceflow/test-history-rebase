import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import type * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { BlockType } from '@/constants';
import { isDialogflowPlatform } from '@/utils/typeGuards';

import type { NodeConfig } from '../types';
import { buttonFactory } from './Editor/Buttons/constants';

export const cardFactory = (platform?: Platform.Constants.PlatformType): BaseNode.Carousel.CarouselCard => ({
  id: Utils.id.cuid.slug(),
  title: '',
  description: SlateEditorAPI.getEmptyState(),
  imageUrl: '',
  // dialog flow has a single button to support the card port.
  // for DF, the single button is hidden in the UI
  buttons: isDialogflowPlatform(platform) ? [buttonFactory()] : [],
});

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Carousel, Realtime.NodeData.CarouselBuiltInPorts> = {
  type: BlockType.CAROUSEL,
  icon: 'carousel',
  isMergeTerminator: ({ data }) =>
    Realtime.Utils.typeGuards.isCarouselNodeData(data) && Boolean(data.noMatch || data.noReply),

  factory: (_, options) => {
    const card = cardFactory(options?.platform);

    return {
      node: {
        ports: {
          in: [{}],
          out: {
            ...Realtime.Utils.port.createEmptyNodeOutPorts(),
            ...(card?.buttons[0]
              ? {
                  byKey: {
                    [card?.buttons[0].id]: {
                      id: Utils.id.objectID(),
                      label: '',
                    },
                  },
                }
              : {}),
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
        cards: [card],
        noMatch: null,
        noReply: null,
      },
    };
  },
};
