export enum SystemTag {
  REVIEWED = 'system.reviewed',
  SAVED = 'system.saved',
  EMOTION_POSITIVE = 'system.emotion_positive',
  EMOTION_NEGATIVE = 'system.emotion_negative',
  EMOTION_NEUTRAL = 'system.emotion_neutral',
}

enum Device {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
}

enum OperatingSystem {
  MAC = 'mac',
  LINUX = 'linux',
  WINDOWS = 'windows',
}

enum Browser {
  CHROME = 'chrome',
  FIREFOX = 'firefox',
  SAFARI = 'safari',
  EDGE = 'edge',
  OTHER = 'other',
}

export interface Transcript {
  // the ID of this transcript
  id: string;
  // the user who recorded this test
  creatorID: number | null;
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
  tags: (string | SystemTag)[];
  // look at mentions format from commenting
  notes: string | null;
  // creation date
  createdAt: number;
}
