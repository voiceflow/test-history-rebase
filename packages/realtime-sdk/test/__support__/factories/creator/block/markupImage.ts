import { Markup } from '@realtime-sdk/models';
import { define } from 'cooky-cutter';
import { datatype, internet } from 'faker';

export const MarkupImageNodeData = define<Markup.NodeData.Image>({
  url: () => internet.url(),
  width: () => datatype.number(),
  height: () => datatype.number(),
  rotate: () => datatype.number(),
});
