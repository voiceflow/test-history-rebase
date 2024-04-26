import type { BaseRequest } from '@voiceflow/dtos';

import type { Trace } from '@/models/Prototype';
import type { Message } from '@/pages/Prototype/types';

// Never change these, they are used in the transcript_report_tags table as specific ids for tags
export enum SystemTag {
  SAVED = 'system.saved',
  REVIEWED = 'system.reviewed',
}

// Never change these, they are used in the transcript_report_tags table as specific ids for tags
export enum Sentiment {
  EMOTION_POSITIVE = 'system.emotion_positive',
  EMOTION_NEGATIVE = 'system.emotion_negative',
  EMOTION_NEUTRAL = 'system.emotion_neutral',
}

export type TagType = string | SystemTag | Sentiment;

export interface AnnotationTurnType {
  utteranceAddedTo?: string;
  utteranceAddedCount?: number;
}

export type Annotations = Record<string, AnnotationTurnType>;

export interface PersonaSnapshot {
  id: string;
  name: string;
  startFrom: { diagramID: string; stepID: string } | null;
  variables: Record<string, any>;
}
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
  device?: string;
  // ie. mac, linux or windows
  os?: string;
  // ie. chrome, firefox
  browser?: string;
  // list of tag IDs and SystemTags
  reportTags: TagType[];
  // look at mentions format from commenting
  notes: string | null;
  // creation date
  createdAt: number;
  // last updated date
  updatedAt: number;
  // session id
  sessionID: string;
  // TODO: change to designated message type
  messages: Message[];
  // the name of the user who recorded this test
  name: string;
  // the imageURL of the user who recorded this test
  image: string;

  annotations: Annotations;

  persona?: PersonaSnapshot;
}

export enum FormatType {
  Trace = 'trace',
  Request = 'request',
  Launch = 'launch',
}

export interface TranscriptMessage {
  turnID: string;
  startTime: string;
  type: string;
  format: string;
  payload: unknown;
}

export interface TraceTranscriptMessage extends TranscriptMessage {
  format: FormatType.Trace;
  payload: Trace;
}

export interface RequestTranscriptMessage extends TranscriptMessage {
  format: FormatType.Request;
  payload: BaseRequest;
}

export interface LaunchTranscriptMessage extends TranscriptMessage {
  format: FormatType.Launch;
  payload: unknown;
}

export type AnyTranscriptMessage = TraceTranscriptMessage | RequestTranscriptMessage | LaunchTranscriptMessage;
