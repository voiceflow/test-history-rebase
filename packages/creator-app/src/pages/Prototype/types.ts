import { Node, Request } from '@voiceflow/base-types';

export enum PMStatus {
  IDLE = 'IDLE',
  ERROR = 'ERROR',
  ENDED = 'ENDED',
  FORCED_DELAY = 'FORCED_DELAY',
  NAVIGATING = 'NAVIGATING',
  FETCHING_CONTEXT = 'FETCHING_CONTEXT',
  DIALOG_PROCESSING = 'DIALOG_PROCESSING',
  WAITING_USER_INTERACTION = 'WAITING_USER_INTERACTION',
  DIALOG_WAITING_USER_INTERACTION = 'DIALOG_WAITING_USER_INTERACTION',
}

export enum TranscriptMessageType {
  BLOCK = 'BLOCK',
  CHOICE = 'CHOICE',
}

export enum MessageType {
  USER = 'USER',
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
  SPEAK = 'SPEAK',
  DEBUG = 'DEBUG',
  STREAM = 'STREAM',
  SESSION = 'SESSION',
  VISUAL = 'VISUAL',
  LAUNCH = 'LAUNCH',
}

export const BotMessageTypes = [MessageType.AUDIO, MessageType.SPEAK, MessageType.TEXT, MessageType.STREAM, MessageType.VISUAL];

type GenericMessage<T extends MessageType, D = {}> = { id: string; type: T; startTime: string; turnID?: string } & D;

export type UserMessage = GenericMessage<MessageType.USER, { input: string; intentName?: string }>;

export type TextMessage = GenericMessage<MessageType.TEXT, { slate: Node.Text.TextData }>;

export type AudioMessage = GenericMessage<MessageType.AUDIO, { name: string; src?: string | null }>;

export type SpeakMessage = GenericMessage<MessageType.SPEAK, { message: string; voice?: string; src?: string | null }>;

export type DebugMessage = GenericMessage<MessageType.DEBUG, { message: string }>;

export type StreamMessage = GenericMessage<MessageType.STREAM, { audio: string }>;

export type SessionMessage = GenericMessage<MessageType.SESSION, { message: string }>;

export type VisualMessage = GenericMessage<MessageType.VISUAL, Node.Visual.ImageStepData>;

export type LaunchMessage = GenericMessage<MessageType.LAUNCH, {}>;

export interface MessageMap {
  [MessageType.USER]: UserMessage;
  [MessageType.TEXT]: TextMessage;
  [MessageType.AUDIO]: AudioMessage;
  [MessageType.SPEAK]: SpeakMessage;
  [MessageType.DEBUG]: DebugMessage;
  [MessageType.STREAM]: StreamMessage;
  [MessageType.SESSION]: SessionMessage;
  [MessageType.VISUAL]: VisualMessage;
  [MessageType.LAUNCH]: LaunchMessage;
}

export type Message =
  | UserMessage
  | TextMessage
  | AudioMessage
  | SpeakMessage
  | DebugMessage
  | SessionMessage
  | StreamMessage
  | VisualMessage
  | LaunchMessage;

export type TypedMessage<T extends MessageType> = MessageMap[T];

export interface Interaction {
  name: string;
  request: Request.AnyRequestButton['request'] | Request.BaseRequest<undefined>;
}
