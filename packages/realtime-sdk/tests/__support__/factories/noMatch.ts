import { NoMatchType, StepNoMatch } from '@voiceflow/base-types/build/node/utils';
import { Prompt } from '@voiceflow/voice-types/build/types';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { NodeData } from '@/models';

import getRandomEnumElement from '../helpers/getRandomEnumElement';
import { promptFactory } from './reprompt';
import { voicePromptNodeDataFactory } from './voice';

export const noMatchesNodeDataFactory = define<NodeData.NoMatches>({
  pathName: () => lorem.word(),
  randomize: () => datatype.boolean(),
  reprompts: () => [voicePromptNodeDataFactory()],
  type: () => getRandomEnumElement(NoMatchType),
});

export const stepNoMatchPromptFactory = define<StepNoMatch<Prompt<any>>>({
  randomize: () => datatype.boolean(),
  reprompts: () => [promptFactory()],
  type: () => getRandomEnumElement(NoMatchType),
  pathName: () => lorem.word(),
});
