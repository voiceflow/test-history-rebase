import { ButtonsLayout, Chip } from '@voiceflow/base-types/build/button';
import { SlateTextValue } from '@voiceflow/base-types/build/text';
import { Node, Types as ChatTypes } from '@voiceflow/chat-types';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { NodeData } from '@/models';
import getRandomEnumElement from '@/tests/helpers/getRandomEnumElement';

import { intentButtonFactory } from '../intent';

export const chipFactory = define<Chip>({
  label: () => lorem.word(),
});

export const promptChatTypeFactory = define<ChatTypes.Prompt>({
  content: () => [{ children: [{ text: lorem.word() }] }] as SlateTextValue,
  id: () => datatype.uuid(),
});

export const captureStepDataFactory = define<Node.Capture.StepData>({
  reprompt: () => promptChatTypeFactory(),
  slot: () => datatype.uuid(),
  slotInputs: () => [datatype.uuid()],
  variable: () => lorem.word(),
  buttons: () => [intentButtonFactory()],
  buttonsLayout: () => getRandomEnumElement(ButtonsLayout),
  chips: () => [chipFactory()],
});

export const captureNodeDataFactory = define<NodeData.Capture>({
  buttons: () => [intentButtonFactory()],
  examples: () => [datatype.uuid()],
  reprompt: () => promptChatTypeFactory(),
  slot: () => datatype.uuid(),
  variable: () => lorem.word(),
});
