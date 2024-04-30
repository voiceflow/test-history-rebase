import type { Markup } from '@/models';

import { createBlockAdapter } from './utils';

const markupVideo = createBlockAdapter<Markup.NodeData.Video, Markup.NodeData.Video>(
  (data) => data,
  (data) => data
);

export default markupVideo;
