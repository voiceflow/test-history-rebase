import { define } from 'cooky-cutter';
import { datatype, internet } from 'faker';

import { Markup } from '@/models';

// eslint-disable-next-line import/prefer-default-export
export const MarkupImageNodeData = define<Markup.NodeData.Image>({
  url: () => internet.url(),
  width: () => datatype.number(),
  height: () => datatype.number(),
  rotate: () => datatype.number(),
});
