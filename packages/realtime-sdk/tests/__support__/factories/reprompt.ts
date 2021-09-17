import { Voice } from '@voiceflow/general-types/build/constants';
import { Prompt } from '@voiceflow/voice-types/build/types';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { RepromptType } from '@/constants';
import { NodeData } from '@/models';

import getRandomEnumElement from '../helpers/getRandomEnumElement';

export const promptFactory = define<Prompt<any>>({
  content: () => lorem.words(),
  voice: () => getRandomEnumElement(Voice),
  desc: () => lorem.words(),
});

export const repromptFactory = define<NodeData.Reprompt>({
  content: () => lorem.words(),
  id: () => datatype.uuid(),
  type: () => getRandomEnumElement(RepromptType),
  audio: () => lorem.words(),
  desc: () => lorem.words(),
  voice: () => getRandomEnumElement(Voice),
});
