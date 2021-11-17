import { NodeData } from '@realtime-sdk/models';
import { getRandomEnumElement } from '@test/utils';
import { Node } from '@voiceflow/base-types';
import { CardType } from '@voiceflow/base-types/build/node/card';
import { define } from 'cooky-cutter';
import { datatype, internet, lorem } from 'faker';

export const CardStepData = define<Node.Card.StepData>({
  text: () => lorem.text(),
  type: () => getRandomEnumElement(CardType),
  title: () => lorem.word(),
  image: () => [],
});

export const CardNodeData = define<NodeData.Card>({
  title: () => lorem.word(),
  content: () => lorem.text(),
  cardType: () => getRandomEnumElement(CardType),
  largeImage: () => internet.url(),
  smallImage: () => internet.url(),
  hasSmallImage: () => datatype.boolean(),
});
