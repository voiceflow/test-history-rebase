import { Node } from '@voiceflow/alexa-types';
import { Voice } from '@voiceflow/alexa-types/build/constants';
import { CanvasNodeVisibility } from '@voiceflow/base-types/build/node/utils';
import { define } from 'cooky-cutter';
import { datatype, internet, lorem } from 'faker';

import { DialogType } from '@/constants';
import { AudioData, NodeData, SSMLData } from '@/models';
import getRandomEnumElement from '@/tests/helpers/getRandomEnumElement';

import { promptFactory } from '../reprompt';

export const ssmlDataFactory = define<SSMLData>({
  content: () => lorem.words(),
  id: () => datatype.uuid(),
  voice: () => getRandomEnumElement(Voice),
  type: DialogType.VOICE,
});

export const audioDataFactory = define<AudioData>({
  id: () => datatype.uuid(),
  desc: () => lorem.words(),
  type: DialogType.AUDIO,
  url: () => internet.url(),
});

export const speakNodeDataFactory = define<NodeData.Speak>({
  dialogs: () => [audioDataFactory(), ssmlDataFactory()],
  randomize: () => datatype.boolean(),
  canvasVisibility: () => getRandomEnumElement(CanvasNodeVisibility),
});

export const speakStepDataFactory = define<Node.Speak.StepData>({
  dialogs: () => [promptFactory()],
  randomize: () => datatype.boolean(),
  canvasVisibility: () => getRandomEnumElement(CanvasNodeVisibility),
});
