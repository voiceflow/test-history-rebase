import { faker } from '@faker-js/faker';
import { DialogType } from '@realtime-sdk/constants';
import type { AudioData, NodeData, SSMLData } from '@realtime-sdk/models';
import type { VoiceNode } from '@voiceflow/voice-types';
import { define, extend } from 'cooky-cutter';

import * as Base from '../base';
import { VoicePrompt } from '../shared';

export const SpeakSSMLData = define<SSMLData>({
  id: () => faker.datatype.uuid(),
  type: (): DialogType.VOICE => DialogType.VOICE,
  voice: () => faker.lorem.words(),
  content: () => faker.lorem.words(),
});

export const SpeakAudioData = define<AudioData>({
  id: () => faker.datatype.uuid(),
  url: () => faker.internet.url(),
  desc: () => faker.lorem.words(),
  type: (): DialogType.AUDIO => DialogType.AUDIO,
});

export const SpeakStepData = extend<ReturnType<typeof Base.SpeakStepData>, VoiceNode.Speak.StepData<any>>(
  Base.SpeakStepData,
  {
    dialogs: () => [VoicePrompt()],
  }
);

export const SpeakNodeData = extend<ReturnType<typeof Base.SpeakNodeData>, NodeData.Speak>(Base.SpeakNodeData, {
  dialogs: () => [SpeakAudioData(), SpeakSSMLData()],
});
