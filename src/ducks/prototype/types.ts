import NLC from '@voiceflow/natural-language-commander';

import { DeviceType } from '@/pages/Prototype/components/PrototypePage/constants';

// trace types
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

export type TraceGeneric<T, P = {}> = {
  id: string;
  type: T;
  payload: P;
};

export type EndTrace = TraceGeneric<TraceType.END>;
export type FlowTrace = TraceGeneric<TraceType.FLOW, { diagramID?: string }>;
export type BlockTrace = TraceGeneric<TraceType.BLOCK, { blockID: string }>;
export type SpeakTrace = TraceGeneric<
  TraceType.SPEAK,
  { src: string; type: SpeakTraceAudioType; voice?: string; message: string; choices: { name: string }[] }
>;
export type DebugTrace = TraceGeneric<TraceType.DEBUG, { message: string }>;

export interface Choice {
  name: string;
}
export type ChoiceTrace = TraceGeneric<TraceType.CHOICE, { choices: Choice[] }>;

export enum StreamTraceAction {
  PLAY = 'PLAY',
  LOOP = 'LOOP',
  PAUSE = 'PAUSE',
}
export type StreamTrace = TraceGeneric<TraceType.STREAM, { src: string; token: string; action: StreamTraceAction }>;

export type Trace = BlockTrace | SpeakTrace | FlowTrace | DebugTrace | StreamTrace | EndTrace | ChoiceTrace;

export type TraceMap = {
  [TraceType.BLOCK]: BlockTrace;
  [TraceType.SPEAK]: SpeakTrace;
  [TraceType.FLOW]: FlowTrace;
  [TraceType.STREAM]: StreamTrace;
  [TraceType.DEBUG]: DebugTrace;
  [TraceType.END]: EndTrace;
  [TraceType.CHOICE]: ChoiceTrace;
};

// context types
export type Store = {
  [key: string]: any;
};

export interface Frame {
  blockID?: string | null;
  diagramID: string;

  storage: Store;
  commands?: Record<string, any>[];
  variables: Store;
}

export enum StoreType {
  TURN = 'turn',
  STORAGE = 'storage',
  VARIABLES = 'variables',
}

export interface Context {
  [StoreType.TURN]: Store;
  [StoreType.STORAGE]: Store;
  [StoreType.VARIABLES]: Store;
  stack: Frame[];
  trace: Trace[];
}

// redux
export enum PrototypeStatus {
  IDLE = 'IDLE',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

export enum InputMode {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
}

export enum PrototypeMode {
  CANVAS = 'Canvas',
  DISPLAY = 'Display',
  DEVELOPER = 'Developer',
  SETTINGS = 'Settings',
}

export interface PrototypeState {
  ID: string | null;
  nlc: NLC | null;
  muted: boolean;
  showChips: boolean;
  status: PrototypeStatus;
  inputMode: InputMode;
  startTime: number;
  context: Context;
  mode: PrototypeMode;
  display: DeviceType | null;
}
