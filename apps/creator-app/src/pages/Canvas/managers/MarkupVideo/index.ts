import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';

import { MarkupNodeManagerConfig } from '../types';
import MarkupVideoNode from './MarkupVideoNode';

const MarkupVideo: MarkupNodeManagerConfig<Realtime.Markup.NodeData.Video> = {
  type: BlockType.MARKUP_VIDEO,

  markupNode: MarkupVideoNode,

  factory: (data) => ({
    node: {
      ports: {},
    },
    data: data as Creator.DataDescriptor<Realtime.Markup.NodeData.Video>,
  }),
};

export default MarkupVideo;
