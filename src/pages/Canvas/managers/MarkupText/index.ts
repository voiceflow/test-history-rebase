import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { Markup } from '@/models';

import { BasicNodeConfig } from '../types';
import MarkupTextEditor from './MarkupTextEditor';
import MarkupTextNode from './MarkupTextNode';

const MarkupText: BasicNodeConfig<Markup.TextNodeData> = {
  type: BlockType.MARKUP_IMAGE,

  editor: MarkupTextEditor as React.FC,
  markupNode: MarkupTextNode,

  factory: (data) => ({
    node: {
      ports: {},
    },
    data: data as Creator.DataDescriptor<Markup.TextNodeData>,
  }),
};

export default MarkupText;
