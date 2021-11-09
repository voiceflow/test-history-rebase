import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';

import { BasicNodeManagerConfig } from '../types';
import MarkupImageNode from './MarkupImageNode';

const MarkupImage: BasicNodeManagerConfig<Realtime.Markup.NodeData.Image> = {
  type: BlockType.MARKUP_IMAGE,

  markupNode: MarkupImageNode,

  factory: (data) => ({
    node: {
      ports: {},
    },
    data: data as Creator.DataDescriptor<Realtime.Markup.NodeData.Image>,
  }),
};

export default MarkupImage;
