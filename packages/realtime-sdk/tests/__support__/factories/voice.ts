import { Voice } from '@voiceflow/alexa-types/build/constants';
import { NoMatchType, StepNoMatch } from '@voiceflow/base-types/build/node/utils';
import { Types as VoiceTypes } from '@voiceflow/voice-types';
import { Prompt } from '@voiceflow/voice-types/build/types';
import { define } from 'cooky-cutter';
import { datatype, lorem, random } from 'faker';

import { RepromptType } from '@/constants';
import { NodeData } from '@/models';

import getRandomEnumElement from '../helpers/getRandomEnumElement';

export const voicePromptNodeDataFactory = define<NodeData.VoicePrompt>({
  content: () => lorem.text(),
  id: () => datatype.uuid(),
  type: () => random.arrayElement(Object.values(RepromptType)),
  audio: () => lorem.words(),
  desc: () => lorem.text(),
  voice: () => lorem.word(),
});

export const voiceTypePromptFactory = define<VoiceTypes.Prompt<any>>({
  content: () => lorem.text(),
  voice: () => lorem.word(),
  desc: () => lorem.text(),
});

export const stepNoMatchVoiceFactory = define<StepNoMatch<Voice>>({
  randomize: () => datatype.boolean(),
  reprompts: () => [getRandomEnumElement(Voice)],
  type: () => getRandomEnumElement(NoMatchType),
  pathName: () => lorem.word(),
});

export const stepNoMatchPromptVoiceFactory = define<StepNoMatch<Prompt<Voice>>>({
  randomize: () => datatype.boolean(),
  reprompts: () => [voiceTypePromptFactory()],
  type: () => getRandomEnumElement(NoMatchType),
  pathName: () => lorem.word(),
});

export const noMatchesNodeDataFactory = define<NodeData.VoiceNoMatches>({
  randomize: () => datatype.boolean(),
  reprompts: () => [voicePromptNodeDataFactory()],
  type: () => getRandomEnumElement(NoMatchType),
  pathName: () => lorem.word(),
});
