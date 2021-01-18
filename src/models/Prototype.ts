import { SpeakTraceAudioType, StoreType, StreamTraceAction, TraceType } from '@/constants/prototype';

// trace types

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

export interface PrototypeContext {
  [StoreType.TURN]: Store;
  [StoreType.STORAGE]: Store;
  [StoreType.VARIABLES]: Store;
  stack: Frame[];
  trace: Trace[];
}
