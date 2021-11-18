import { Markup } from '@realtime-sdk/models';

import { createBlockAdapter } from './utils';

const markupImage = createBlockAdapter<Markup.NodeData.Image, Markup.NodeData.Image>(
  (data) => data,
  (data) => data
);

export default markupImage;
