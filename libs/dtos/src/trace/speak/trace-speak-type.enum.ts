export const TraceSpeakType = {
  AUDIO: 'audio',
  MESSAGE: 'message',
} as const;

export type TraceSpeakType = (typeof TraceSpeakType)[keyof typeof TraceSpeakType];
