import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { Markup } from '@/models';

import { BasicNodeManagerConfig } from '../types';
import MarkupImageNode from './MarkupImageNode';

const MarkupImage: BasicNodeManagerConfig<Markup.NodeData.Image> = {
  type: BlockType.MARKUP_IMAGE,

  markupNode: MarkupImageNode,

  factory: (data) => ({
    node: {
      ports: {},
    },
    data: data as Creator.DataDescriptor<Markup.NodeData.Image>,
  }),
};

export default MarkupImage;
