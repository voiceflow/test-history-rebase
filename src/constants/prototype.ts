export enum TraceType {
  BLOCK = 'block',
  SPEAK = 'speak',
  FLOW = 'flow',
  STREAM = 'stream',
  DEBUG = 'debug',
  END = 'end',
  CHOICE = 'choice',
}

export enum SpeakTraceAudioType {
  AUDIO = 'audio',
  MESSAGE = 'message',
}

export enum StreamTraceAction {
  PLAY = 'PLAY',
  LOOP = 'LOOP',
  PAUSE = 'PAUSE',
}

export enum StoreType {
  TURN = 'turn',
  STORAGE = 'storage',
  VARIABLES = 'variables',
}
