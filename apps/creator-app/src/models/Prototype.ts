import { BaseNode, BaseTrace } from '@voiceflow/base-types';

import { StoreType } from '@/constants/prototype';

// trace types

export type TraceWithID<T extends BaseNode.Utils.BaseTraceFrame> = { id: string } & T;

export type EndTrace = TraceWithID<BaseTrace.ExitTrace>;
export type FlowTrace = TraceWithID<BaseTrace.FlowTrace>;
export type BlockTrace = TraceWithID<BaseTrace.BlockTrace>;
export type SpeakTrace = TraceWithID<BaseTrace.SpeakTrace>;
export type DebugTrace = TraceWithID<BaseTrace.DebugTrace>;
export type ChoiceTrace = TraceWithID<BaseTrace.ChoiceTrace>;
export type StreamTrace = TraceWithID<BaseTrace.StreamTrace>;
export type VisualTrace = TraceWithID<BaseTrace.VisualTrace>;
export type PathTrace = TraceWithID<BaseTrace.PathTrace>;
export type TextTrace = TraceWithID<BaseTrace.TextTrace>;
export type CarouselTrace = TraceWithID<BaseTrace.CarouselTrace>;
export type CardV2Trace = TraceWithID<BaseNode.CardV2.TraceFrame>;
export type ChannelActionTrace = TraceWithID<BaseTrace.ChannelActionTrace>;
export type GoToTrace = TraceWithID<BaseTrace.GoToTrace>;
export type NoReplyTrace = TraceWithID<BaseTrace.NoReplyTrace>;
export type V1Trace = Required<BaseNode.Utils.BaseTraceFrame>;
export type BaseTraceFrame = BaseNode.Utils.BaseTraceFrame;

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
  | GoToTrace
  | NoReplyTrace
  | CarouselTrace
  | CardV2Trace
  | ChannelActionTrace;

// context types

export interface Store {
  [key: string]: any;
}

export interface Frame {
  nodeID?: string | null;
  programID: string;

  storage: Store;
  commands?: Record<string, any>[];
  variables: Store;
}

export interface PrototypeContext {
  [StoreType.TURN]: Store;
  [StoreType.STORAGE]: Store;
  [StoreType.VARIABLES]: Store;
  stack?: Frame[];
  trace: Trace[];
}
