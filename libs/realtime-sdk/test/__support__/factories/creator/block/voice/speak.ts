import { DialogType } from '@realtime-sdk/constants';
import { AudioData, NodeData, SSMLData } from '@realtime-sdk/models';
import { VoiceNode } from '@voiceflow/voice-types';
import { define, extend } from 'cooky-cutter';
import { datatype, internet, lorem } from 'faker';

import * as Base from '../base';
import { VoicePrompt } from '../shared';

export const SpeakSSMLData = define<SSMLData>({
  id: () => datatype.uuid(),
  type: (): DialogType.VOICE => DialogType.VOICE,
  voice: () => lorem.words(),
  content: () => lorem.words(),
});

export const SpeakAudioData = define<AudioData>({
  id: () => datatype.uuid(),
  url: () => internet.url(),
  desc: () => lorem.words(),
  type: (): DialogType.AUDIO => DialogType.AUDIO,
});

export const SpeakStepData = extend<ReturnType<typeof Base.SpeakStepData>, VoiceNode.Speak.StepData<any>>(Base.SpeakStepData, {
  dialogs: () => [VoicePrompt()],
});

export const SpeakNodeData = extend<ReturnType<typeof Base.SpeakNodeData>, NodeData.Speak>(Base.SpeakNodeData, {
  dialogs: () => [SpeakAudioData(), SpeakSSMLData()],
});
