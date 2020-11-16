import { Markup } from '@/models';

import { createBlockAdapter } from './utils';

const markupText = createBlockAdapter<Markup.NodeData.Text, Markup.NodeData.Text>(
  (data) => data,
  (data) => data
);

export default markupText;
