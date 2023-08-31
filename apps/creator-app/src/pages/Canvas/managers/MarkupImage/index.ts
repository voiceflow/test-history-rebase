import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';

import { MarkupNodeManagerConfig } from '../types';
import MarkupImageNode from './MarkupImageNode';

const MarkupImage: MarkupNodeManagerConfig<Realtime.Markup.NodeData.Image> = {
  type: BlockType.MARKUP_IMAGE,

  markupNode: MarkupImageNode,

  factory: (data) => ({
    node: {
      ports: {},
    },
    data: data as CreatorV2.DataDescriptor<Realtime.Markup.NodeData.Image>,
  }),
};

export default MarkupImage;
