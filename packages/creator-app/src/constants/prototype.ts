import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

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

export const getDefaultPrototypeLayout = Utils.platform.createProjectTypeSelector({
  [VoiceflowConstants.ProjectType.CHAT]: PrototypeLayout.TEXT_DIALOG,
  [VoiceflowConstants.ProjectType.VOICE]: PrototypeLayout.VOICE_DIALOG,
});
