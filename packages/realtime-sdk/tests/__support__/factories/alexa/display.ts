import { Node } from '@voiceflow/alexa-types';
import { Node as BaseNode } from '@voiceflow/base-types';
import { APLType, VisualType } from '@voiceflow/base-types/build/node/visual';
import { define } from 'cooky-cutter';
import { internet, lorem } from 'faker';

import getRandomEnumElement from '@/tests/helpers/getRandomEnumElement';

export const displayStepDataFactory = define<Node.Display.StepData>({
  type: () => getRandomEnumElement(APLType),
  aplCommands: () => lorem.word(),
  datasource: () => lorem.word(),
  document: () => internet.url(),
  imageURL: () => internet.url(),
  jsonFileName: () => lorem.word(),
  title: () => lorem.words(),
});

export const displayNodeDataFactory = define<BaseNode.Visual.APLStepData>({
  aplType: () => getRandomEnumElement(APLType),
  visualType: VisualType.APL,
  aplCommands: () => lorem.word(),
  datasource: () => lorem.word(),
  document: () => internet.url(),
  imageURL: () => internet.url(),
  jsonFileName: () => lorem.word(),
  title: () => lorem.words(),
});
