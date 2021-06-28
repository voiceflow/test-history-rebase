export enum SystemTag {
  REVIEWED = 'system.reviewed',
  SAVED = 'system.saved',
}

export enum Sentiment {
  EMOTION_POSITIVE = 'system.emotion_positive',
  EMOTION_NEGATIVE = 'system.emotion_negative',
  EMOTION_NEUTRAL = 'system.emotion_neutral',
}

export const SentimentArray = [Sentiment.EMOTION_POSITIVE, Sentiment.EMOTION_NEGATIVE, Sentiment.EMOTION_NEUTRAL];

export const SystemTagArray = [SystemTag.REVIEWED, SystemTag.SAVED];

export enum Device {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
}

export enum OperatingSystem {
  MAC = 'mac',
  LINUX = 'linux',
  WINDOWS = 'windows',
}

export enum Browser {
  CHROME = 'chrome',
  FIREFOX = 'firefox',
  SAFARI = 'safari',
  EDGE = 'edge',
  OTHER = 'other',
}

export type TagType = string | SystemTag | Sentiment;

export interface Transcript {
  // the id of this transcript
  id: string;
  // the user who recorded this test
  creatorID: string | null;
  // the project this transcript is related to
  projectID: string;
  // drives the "read" indicator in the results list
  unread: boolean;
  // ie. desktop or mobile
  device: Device;
  // ie. mac, linux or windows
  os: OperatingSystem;
  // ie. chrome, firefox
  browser: Browser;
  // list of tag IDs and SystemTags
  tags: TagType[];
  // look at mentions format from commenting
  notes: string | null;
  // creation date
  createdAt: number;
}
