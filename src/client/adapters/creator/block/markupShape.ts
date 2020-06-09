import { Markup } from '@/models';

import { createBlockAdapter } from './utils';

const markupShape = createBlockAdapter<Markup.NodeData.Shape, Markup.NodeData.Shape>(
  (data) => data,
  (data) => data
);

export default markupShape;
