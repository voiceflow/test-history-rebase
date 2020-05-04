export type NLCIntentSlot = {
  name: string;
  value?: any;
};

export type NLCIntent = {
  intent: string;
  slots?: NLCIntentSlot[];
};

export enum PMStatus {
  IDLE = 'IDLE',
  ERROR = 'ERROR',
  ENDED = 'ENDED',
  NAVIGATING = 'NAVIGATING',
  FETCHING_CONTEXT = 'FETCHING_CONTEXT',
  DIALOG_PROCESSING = 'DIALOG_PROCESSING',
  WAITING_USER_INTERACTION = 'WAITING_USER_INTERACTION',
  DIALOG_WAITING_USER_INTERACTION = 'DIALOG_WAITING_USER_INTERACTION',
}

export enum TMAmazonIntent {
  NEXT = 'AMAZON.NextIntent',
  PAUSE = 'AMAZON.PauseIntent',
  RESUME = 'AMAZON.ResumeIntent',
  PREVIOUS = 'AMAZON.PreviousIntent',
  YES = 'AMAZON.YesIntent',
  NO = 'AMAZON.NoIntent',
}

export enum MessageType {
  USER = 'USER',
  AUDIO = 'AUDIO',
  SPEAK = 'SPEAK',
  DEBUG = 'DEBUG',
  STREAM = 'STREAM',
  SESSION = 'SESSION',
}

type GenericMessage<T extends MessageType, D = {}> = { id: string; type: T; startTime: string } & D;

export type UserMessage = GenericMessage<MessageType.USER, { input: string }>;

export type AudioMessage = GenericMessage<MessageType.AUDIO, { name: string; src: string }>;

export type SpeakMessage = GenericMessage<MessageType.SPEAK, { message: string; voice?: string; src: string }>;

export type DebugMessage = GenericMessage<MessageType.DEBUG, { message: string }>;

export type StreamMessage = GenericMessage<MessageType.STREAM, { audio: string }>;

export type SessionMessage = GenericMessage<MessageType.SESSION, { message: string }>;

export type MessageMap = {
  [MessageType.USER]: UserMessage;
  [MessageType.AUDIO]: AudioMessage;
  [MessageType.SPEAK]: SpeakMessage;
  [MessageType.DEBUG]: DebugMessage;
  [MessageType.STREAM]: StreamMessage;
  [MessageType.SESSION]: SessionMessage;
};

export type Message = UserMessage | AudioMessage | SpeakMessage | DebugMessage | SessionMessage | StreamMessage;

export type TypedMessage<T extends MessageType> = MessageMap[T];

export interface Interaction {
  name: string;
}
