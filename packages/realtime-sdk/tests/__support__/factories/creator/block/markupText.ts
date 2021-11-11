import { define } from 'cooky-cutter';
import { datatype } from 'faker';

import { Markup } from '@/models';

// eslint-disable-next-line import/prefer-default-export
export const MarkupTextNodeData = define<Markup.NodeData.Text>({
  scale: () => datatype.number(),
  rotate: () => datatype.number(),
  content: () => [{ blocks: [], entityMap: {}, text: '' }],
  overrideWidth: () => datatype.number(),
  backgroundColor: () => ({ r: datatype.number(), g: datatype.number(), b: datatype.number(), a: datatype.number() }),
});
