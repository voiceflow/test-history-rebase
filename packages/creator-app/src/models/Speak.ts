import { DialogType, PlatformType } from '@/constants';

export type DBAudioData = {
  audio: string;
};

export type AudioData = {
  id: string;
  url: string;
  type: DialogType.AUDIO;
  desc?: string;
};

export type DBSSMLData = {
  voice: PlatformType;
};

export type SSMLData = {
  id: string;
  type: DialogType.VOICE;
  voice: string;
  content: string; // instead of draftJS object just use the raw string (diff from speak block)
};

export type SpeakData = SSMLData | AudioData;
