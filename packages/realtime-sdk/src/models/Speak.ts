import { DialogType } from '@realtime-sdk/constants';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export interface DBAudioData {
  audio: string;
}

export interface AudioData {
  id: string;
  url: string;
  type: DialogType.AUDIO;
  desc?: string;
}

export interface DBSSMLData {
  voice: VoiceflowConstants.PlatformType;
}

export interface SSMLData {
  id: string;
  type: DialogType.VOICE;
  voice: string;
  content: string; // instead of draftJS object just use the raw string (diff from speak block)
}

export type SpeakData = SSMLData | AudioData;
