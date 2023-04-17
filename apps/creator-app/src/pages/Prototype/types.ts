import { BaseButton, BaseNode, BaseRequest } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { PrototypeStatus } from '@/constants/prototype';
import type { ActivePath, Context, PrototypeState, UpdatePrototypeVisualData } from '@/ducks/prototype';
import type { PrototypeConfig } from '@/ducks/recent';
import type { IDSelectorParam } from '@/ducks/utils/crudV2';

export type OnInteraction = (interaction: { name?: string | undefined; request: BaseRequest.BaseRequest | string }) => void;

export enum PMStatus {
  IDLE = 'IDLE',
  ERROR = 'ERROR',
  ENDED = 'ENDED',
  NAVIGATING = 'NAVIGATING',
  FETCHING_CONTEXT = 'FETCHING_CONTEXT',
  FAKE_LOADING = 'FAKE_LOADING',
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
  PATH = 'PATH',
  CAROUSEL = 'CAROUSEL',
  CARD = 'CARD',
  CHANNEL_ACTION = 'CHANNEL_ACTION',
}

export const BotMessageTypes = [MessageType.AUDIO, MessageType.SPEAK, MessageType.TEXT, MessageType.STREAM, MessageType.VISUAL, MessageType.CAROUSEL];

type GenericMessage<T extends MessageType, D = {}> = { id: string; type: T; startTime: string; turnID?: string } & D;

export type UserMessage = GenericMessage<MessageType.USER, { input: string; intentName?: string; confidence?: number | null }>;

export type TextMessage = GenericMessage<MessageType.TEXT, { slate: BaseNode.Text.TextData; ai?: boolean }>;

export type AudioMessage = GenericMessage<MessageType.AUDIO, { name: string; src?: string | null; ai?: boolean }>;

export type SpeakMessage = GenericMessage<MessageType.SPEAK, { message: string; voice?: string; src?: string | null; ai?: boolean }>;

export type DebugMessage = GenericMessage<MessageType.DEBUG, { message: string }>;

export type StreamMessage = GenericMessage<MessageType.STREAM, { audio: string }>;

export type SessionMessage = GenericMessage<MessageType.SESSION, { message: string }>;

export type VisualMessage = GenericMessage<MessageType.VISUAL, BaseNode.Visual.ImageStepData | BaseNode.Visual.APLStepData>;

export type PathMessage = GenericMessage<MessageType.PATH, { path: string }>;

export type LaunchMessage = GenericMessage<MessageType.LAUNCH, {}>;

export type CarouselMessage = GenericMessage<
  MessageType.CAROUSEL,
  { cards: BaseNode.Carousel.TraceCarouselCard[]; layout: BaseNode.Carousel.CarouselLayout }
>;

export type CardMessage = GenericMessage<MessageType.CARD, BaseNode.CardV2.TraceCardV2>;
export type ChannelActionMessage = GenericMessage<
  MessageType.CHANNEL_ACTION,
  {
    id: string;
    name: string;
  }
>;

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
  [MessageType.PATH]: PathMessage;
  [MessageType.CAROUSEL]: CarouselMessage;
  [MessageType.CARD]: CardMessage;
  [MessageType.CHANNEL_ACTION]: ChannelActionMessage;
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
  | LaunchMessage
  | PathMessage
  | CarouselMessage
  | CardMessage
  | ChannelActionMessage;

export type TypedMessage<T extends MessageType> = MessageMap[T];

export interface Interaction {
  name: string;
  request: BaseRequest.AnyRequestButton['request'] | BaseRequest.BaseRequest<undefined> | BaseRequest.BaseRequest<string>;
  isActionButton?: boolean;
}

export interface ProtoConfigType extends PrototypeConfig {
  buttons: BaseButton.ButtonsLayout;
  autoplay: boolean;
  showButtons: boolean;
  prototypeColor: string;
  prototypeAvatar: string;
  locales: string[];
  isMuted: boolean;
  durationMilliseconds?: number;
}

export interface PrototypeRuntimeState {
  status: PrototypeStatus;
  activePaths: Record<string, ActivePath>;
  contextHistory?: Partial<Context>[];
  activeDiagramID: string | null;
  flowIDHistory: string[];
  webhook?: BaseRequest.BaseRequest | null;
  contextStep: number;
  visualDataHistory?: (BaseNode.Visual.StepData | null)[];
}

export interface PrototypeActions {
  updatePrototype: (data: Partial<PrototypeState>) => void;
  savePrototypeSession: () => void;
  getLinksByPortID?: (id: IDSelectorParam) => any[];
  getNodeByID?: (id: string) => Realtime.Node;
  updatePrototypeVisualsData?: (data: Nullable<BaseNode.Visual.StepData>) => UpdatePrototypeVisualData;
  fetchContext?: (
    request: Nullable<BaseRequest.BaseRequest>,
    config: PrototypeConfig,
    options?: { isPublic?: boolean }
  ) => Promise<Nullable<Context>>;
  setActiveDiagramID?: (id: string) => void;
  updatePrototypeVisualsDataHistory?: (data: Nullable<BaseNode.Visual.StepData>[]) => void;
  updatePrototypeStatus?: (data: PrototypeStatus) => void;
  setError?: (error: string) => Promise<void>;
}

export interface PrototypeAllTypes {
  config: ProtoConfigType;
  state: PrototypeRuntimeState;
  actions: PrototypeActions;
}
