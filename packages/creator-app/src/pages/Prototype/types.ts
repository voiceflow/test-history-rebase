import { BaseRequest } from '@voiceflow/general-types';
import { ImageStepData } from '@voiceflow/general-types/build/nodes/visual';

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

export enum MessageType {
  USER = 'USER',
  AUDIO = 'AUDIO',
  SPEAK = 'SPEAK',
  DEBUG = 'DEBUG',
  STREAM = 'STREAM',
  SESSION = 'SESSION',
  VISUAL = 'VISUAL',
}

export const BotMessageTypes = [MessageType.AUDIO, MessageType.SPEAK, MessageType.STREAM, MessageType.VISUAL];

type GenericMessage<T extends MessageType, D = {}> = { id: string; type: T; startTime: string } & D;

export type UserMessage = GenericMessage<MessageType.USER, { input: string }>;

export type AudioMessage = GenericMessage<MessageType.AUDIO, { name: string; src?: string | null }>;

export type SpeakMessage = GenericMessage<MessageType.SPEAK, { message: string; voice?: string; src?: string | null }>;

export type DebugMessage = GenericMessage<MessageType.DEBUG, { message: string }>;

export type StreamMessage = GenericMessage<MessageType.STREAM, { audio: string }>;

export type SessionMessage = GenericMessage<MessageType.SESSION, { message: string }>;

export type VisualMessage = GenericMessage<MessageType.VISUAL, ImageStepData>;

export type MessageMap = {
  [MessageType.USER]: UserMessage;
  [MessageType.AUDIO]: AudioMessage;
  [MessageType.SPEAK]: SpeakMessage;
  [MessageType.DEBUG]: DebugMessage;
  [MessageType.STREAM]: StreamMessage;
  [MessageType.SESSION]: SessionMessage;
  [MessageType.VISUAL]: VisualMessage;
};

export type Message = UserMessage | AudioMessage | SpeakMessage | DebugMessage | SessionMessage | StreamMessage | VisualMessage;

export type TypedMessage<T extends MessageType> = MessageMap[T];

export interface Interaction {
  name: string;
  request?: BaseRequest;
}
