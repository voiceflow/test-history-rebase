import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { Markup } from '@/models';

import { BasicNodeConfig } from '../types';
import MarkupImageNode from './MarkupImageNode';

const MarkupImage: BasicNodeConfig<Markup.ImageNodeData> = {
  type: BlockType.MARKUP_IMAGE,

  markupNode: MarkupImageNode,

  factory: (data) => ({
    node: {
      ports: {},
    },
    data: data as Creator.DataDescriptor<Markup.ImageNodeData>,
  }),
};

export default MarkupImage;
