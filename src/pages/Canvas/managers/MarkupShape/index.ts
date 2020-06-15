import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { Markup } from '@/models';

import { BasicNodeConfig } from '../types';
import MarkupShapeEditor from './MarkupShapeEditor';
import MarkupShapeNode from './MarkupShapeNode';

const MarkupShape: BasicNodeConfig<Markup.NodeData.Shape> = {
  type: BlockType.MARKUP_SHAPE,

  markupNode: MarkupShapeNode,
  editor: MarkupShapeEditor,

  factory: (data) => ({
    node: {
      ports: {},
    },
    data: data as Creator.DataDescriptor<Markup.NodeData.Shape>,
  }),
};

export default MarkupShape;
