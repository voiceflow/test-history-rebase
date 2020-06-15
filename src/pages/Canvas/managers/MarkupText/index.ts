import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { Markup } from '@/models';

import { BasicNodeConfig } from '../types';
import MarkupTextEditor from './MarkupTextEditor';
import MarkupTextNode from './MarkupTextNode';

const MarkupText: BasicNodeConfig<Markup.NodeData.Text> = {
  type: BlockType.MARKUP_IMAGE,

  editor: MarkupTextEditor,
  markupNode: MarkupTextNode,

  factory: (data) => ({
    node: {
      ports: {},
    },
    data: data as Creator.DataDescriptor<Markup.NodeData.Text>,
  }),
};

export default MarkupText;
