import { Node } from '@voiceflow/base-types';
import { CardType } from '@voiceflow/base-types/build/node/card';
import { define } from 'cooky-cutter';
import { datatype, internet, lorem } from 'faker';

import { NodeData } from '@/models';
import getRandomEnumElement from '@/tests/helpers/getRandomEnumElement';

export const cardStepDataFactory = define<Node.Card.StepData>({
  text: () => lorem.text(),
  title: () => lorem.word(),
  type: () => getRandomEnumElement(CardType),
  image: () => [],
});

export const cardNodeDataFactory = define<NodeData.Card>({
  cardType: () => getRandomEnumElement(CardType),
  content: () => lorem.text(),
  hasSmallImage: () => datatype.boolean(),
  largeImage: () => internet.url(),
  smallImage: () => internet.url(),
  title: () => lorem.word(),
});
