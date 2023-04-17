import { getRandomEnumElement } from '@test/utils';
import { AlexaNode } from '@voiceflow/alexa-types';
import { BaseNode } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';
import { internet, lorem } from 'faker';

export const DisplayStepData = define<AlexaNode.Display.StepData>({
  type: () => getRandomEnumElement(BaseNode.Visual.APLType),
  title: () => lorem.words(),
  document: () => internet.url(),
  imageURL: () => internet.url(),
  datasource: () => lorem.word(),
  aplCommands: () => lorem.word(),
  jsonFileName: () => lorem.word(),
});

export const DisplayNodeData = define<BaseNode.Visual.APLStepData>({
  title: () => lorem.words(),
  aplType: () => getRandomEnumElement(BaseNode.Visual.APLType),
  document: () => internet.url(),
  imageURL: () => internet.url(),
  datasource: () => lorem.word(),
  visualType: (): BaseNode.Visual.VisualType.APL => BaseNode.Visual.VisualType.APL,
  aplCommands: () => lorem.word(),
  jsonFileName: () => lorem.word(),
});
