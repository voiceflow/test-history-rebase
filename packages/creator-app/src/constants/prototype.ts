import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { createPlatformSelector } from '@/utils/platform';

export enum SpeakTraceAudioType {
  AUDIO = 'audio',
  MESSAGE = 'message',
}

export enum StoreType {
  TURN = 'turn',
  STORAGE = 'storage',
  VARIABLES = 'variables',
}

export enum PrototypeLayout {
  TEXT_DIALOG = 'text-and-dialog',
  VOICE_DIALOG = 'voice-and-dialog',
  VOICE_VISUALS = 'voice-and-visuals',
}

export enum PrototypeStatus {
  IDLE = 'IDLE',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

export enum PrototypeInputMode {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
}

export enum PrototypeMode {
  CANVAS = 'Canvas',
  DISPLAY = 'Display',
  VARIABLES = 'Variables',
  SETTINGS = 'Settings',
}

export const getDefaultPrototypeLayout = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.CHATBOT]: PrototypeLayout.TEXT_DIALOG,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: PrototypeLayout.TEXT_DIALOG,
  },
  PrototypeLayout.VOICE_DIALOG
);
