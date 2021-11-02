import { Node, Trace } from '@voiceflow/base-types';

import { StoreType } from '@/constants/prototype';

// trace types

export type TraceWithID<T extends Node.Utils.BaseTraceFrame> = { id: string } & T;

export type EndTrace = TraceWithID<Trace.ExitTrace>;
export type FlowTrace = TraceWithID<Trace.FlowTrace>;
export type BlockTrace = TraceWithID<Trace.BlockTrace>;
export type SpeakTrace = TraceWithID<Trace.SpeakTrace>;
export type DebugTrace = TraceWithID<Trace.DebugTrace>;
export type ChoiceTrace = TraceWithID<Trace.ChoiceTrace>;
export type StreamTrace = TraceWithID<Trace.StreamTrace>;
export type VisualTrace = TraceWithID<Trace.VisualTrace>;
export type PathTrace = TraceWithID<Trace.PathTrace>;
export type TextTrace = TraceWithID<Trace.TextTrace>;
export type GoToTrace = TraceWithID<Trace.GoToTrace>;
export type V1Trace = Required<Node.Utils.BaseTraceFrame>;
export type BaseTraceFrame = Node.Utils.BaseTraceFrame;

export type Trace =
  | BlockTrace
  | SpeakTrace
  | FlowTrace
  | DebugTrace
  | StreamTrace
  | EndTrace
  | ChoiceTrace
  | VisualTrace
  | TextTrace
  | PathTrace
  | GoToTrace;

// context types

export interface Store {
  [key: string]: any;
}

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
