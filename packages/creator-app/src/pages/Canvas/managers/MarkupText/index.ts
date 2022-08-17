import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';

import { MarkupNodeManagerConfig } from '../types';
import MarkupTextEditor from './MarkupTextEditor';
import MarkupTextNode from './MarkupTextNode';

const MarkupText: MarkupNodeManagerConfig<Realtime.Markup.NodeData.Text> = {
  type: BlockType.MARKUP_TEXT,

  editor: MarkupTextEditor,
  markupNode: MarkupTextNode,

  factory: (data) => ({
    node: {
      ports: {},
    },
    data: data as Creator.DataDescriptor<Realtime.Markup.NodeData.Text>,
  }),
};

export default MarkupText;
