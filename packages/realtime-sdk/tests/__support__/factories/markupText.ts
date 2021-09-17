import { define } from 'cooky-cutter';
import { datatype } from 'faker';

import { Markup } from '@/models';

const markupNodeDataTextFactory = define<Markup.NodeData.Text>({
  backgroundColor: () => ({ r: datatype.number(), g: datatype.number(), b: datatype.number(), a: datatype.number() }),
  content: () => [{ blocks: [], entityMap: {}, text: '' }],
  overrideWidth: () => datatype.number(),
  rotate: () => datatype.number(),
  scale: () => datatype.number(),
});

export default markupNodeDataTextFactory;
