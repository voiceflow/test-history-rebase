import { PlatformType } from '@voiceflow/internal';

import { DialogType } from '@/constants';

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
  voice: PlatformType;
}

export interface SSMLData {
  id: string;
  type: DialogType.VOICE;
  voice: string;
  content: string; // instead of draftJS object just use the raw string (diff from speak block)
}

export type SpeakData = SSMLData | AudioData;
