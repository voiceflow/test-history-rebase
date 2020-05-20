import { Markup } from '@/models';

import { createBlockAdapter } from './utils';

const markupImage = createBlockAdapter<Markup.ImageNodeData, Markup.ImageNodeData>(
  (data) => data,
  (data) => data
);

export default markupImage;
