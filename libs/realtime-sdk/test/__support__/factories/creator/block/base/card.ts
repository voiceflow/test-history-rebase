import { NodeData } from '@realtime-sdk/models';
import { getRandomEnumElement } from '@test/utils';
import { BaseNode } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';
import { datatype, internet, lorem } from 'faker';

export const CardStepData = define<BaseNode.Card.StepData>({
  text: () => lorem.text(),
  type: () => getRandomEnumElement(BaseNode.Card.CardType),
  title: () => lorem.word(),
  image: () => [],
});

export const CardNodeData = define<NodeData.Card>({
  title: () => lorem.word(),
  content: () => lorem.text(),
  cardType: () => getRandomEnumElement(BaseNode.Card.CardType),
  largeImage: () => internet.url(),
  smallImage: () => internet.url(),
  hasSmallImage: () => datatype.boolean(),
});
