import type * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import type * as CreatorV2 from '@/ducks/creatorV2';

import type { MarkupNodeManagerConfig } from '../types';
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
    data: data as CreatorV2.DataDescriptor<Realtime.Markup.NodeData.Text>,
  }),
};

export default MarkupText;
