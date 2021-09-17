import { define } from 'cooky-cutter';
import { datatype, internet } from 'faker';

import { Markup } from '@/models';

const markupImageFactory = define<Markup.NodeData.Image>({
  height: () => datatype.number(),
  rotate: () => datatype.number(),
  url: () => internet.url(),
  width: () => datatype.number(),
});

export default markupImageFactory;
