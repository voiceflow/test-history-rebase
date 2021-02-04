import * as Traces from '@voiceflow/general-types/build/trace';

import { StoreType } from '@/constants/prototype';

// trace types

export type TraceWithID<T extends Traces.GeneralTrace> = { id: string } & T;

export type EndTrace = TraceWithID<Traces.ExitTrace>;
export type FlowTrace = TraceWithID<Traces.FlowTrace>;
export type BlockTrace = TraceWithID<Traces.BlockTrace>;
export type SpeakTrace = TraceWithID<Traces.SpeakTrace>;
export type DebugTrace = TraceWithID<Traces.DebugTrace>;
export type ChoiceTrace = TraceWithID<Traces.ChoiceTrace>;
export type StreamTrace = TraceWithID<Traces.StreamTrace>;
export type VisualTrace = TraceWithID<Traces.VisualTrace>;

export type Trace = BlockTrace | SpeakTrace | FlowTrace | DebugTrace | StreamTrace | EndTrace | ChoiceTrace | VisualTrace;

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
