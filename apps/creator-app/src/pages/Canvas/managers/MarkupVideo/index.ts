import type * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import type * as CreatorV2 from '@/ducks/creatorV2';

import type { MarkupNodeManagerConfig } from '../types';
import MarkupVideoNode from './MarkupVideoNode';

const MarkupVideo: MarkupNodeManagerConfig<Realtime.Markup.NodeData.Video> = {
  type: BlockType.MARKUP_VIDEO,

  markupNode: MarkupVideoNode,

  factory: (data) => ({
    node: {
      ports: {},
    },
    data: data as CreatorV2.DataDescriptor<Realtime.Markup.NodeData.Video>,
  }),
};

export default MarkupVideo;
