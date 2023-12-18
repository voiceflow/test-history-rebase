import { BlockType } from '@realtime-sdk/constants';
import { AlexaNode } from '@voiceflow/alexa-types';
import { BaseButton, BaseModels, BaseNode } from '@voiceflow/base-types';
import { ChatNode } from '@voiceflow/chat-types';
import { EmptyObject, Nullable } from '@voiceflow/common';
import { FunctionNode } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config/backend';
import { VoiceNode } from '@voiceflow/voice-types';
import { VoiceflowNode } from '@voiceflow/voiceflow-types';

import { ExpressionData } from './Expression';
import type { Markup } from './Markup';
import { SpeakData } from './Speak';

export type NodeData<T> = T & {
  nodeID: string;
  name: string;
  type: BlockType;
  deprecatedType?: string;
};

export type NodeDataDescriptor<T> = Omit<NodeData<T>, 'nodeID'>;

export type BlockNodeData<T> = NodeData<T> & {
  blockColor: string;
};

export namespace NodeData {
  export interface VoiceNoReply extends Omit<VoiceNode.Utils.StepNoReply<any>, 'reprompts'> {
    reprompts?: Platform.Common.Voice.Models.Prompt.Model[];
  }

  // TODO: refactor node data types to be platform specific instead of unions
  export type NoReply = VoiceNoReply | ChatNode.Utils.StepNoReply;

  export interface BaseNoMatch {
    types: BaseNode.Utils.NoMatchType[];
    pathName: string;
    randomize: boolean;
  }

  export interface VoiceNoMatch extends BaseNoMatch {
    reprompts: Platform.Common.Voice.Models.Prompt.Model[];
  }

  export interface ChatNoMatch extends BaseNoMatch {
    reprompts: Platform.Common.Chat.Models.Prompt.Model[];
  }

  export type NoMatch = VoiceNoMatch | ChatNoMatch;

  export interface Start {
    name: string;
    label: string;
    blockColor: string;
  }

  export interface Combined {
    name: string;
    blockColor: string;
  }

  export type Actions = EmptyObject;

  export interface Code extends BaseNode.Code.StepData {}

  export interface CodeBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
    [BaseModels.PortType.FAIL]: string;
  }

  export type Deprecated = {
    deprecatedType: string;
  } & Record<string, unknown>;

  export interface Random {
    paths: number;
    noDuplicates: boolean;
  }

  export interface RandomV2 {
    namedPaths: { label: string }[];
    noDuplicates: boolean;
  }

  export interface Permission {
    permissions: string[];
  }

  export interface PermissionBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }

  export interface InteractionChoice {
    id: string;
    intent: string | null;
    mappings: BaseModels.SlotMapping[];
  }

  export interface Interaction {
    name: string;
    noMatch: Nullable<NoMatch>;
    choices: InteractionChoice[];
    buttons: BaseButton.AnyButton[] | null;
    noReply: Nullable<NoReply>;
    intentScope?: BaseNode.Utils.IntentScope;
  }

  export interface InteractionBuiltInPorts {
    [BaseModels.PortType.NO_MATCH]?: string;
    [BaseModels.PortType.NO_REPLY]?: string;
  }

  export interface Prompt {
    buttons: BaseButton.AnyButton[] | null;
    noReply: Nullable<NoReply>;
    noMatch: Nullable<NoMatch>;
  }

  export interface PromptBuiltInPorts {
    [BaseModels.PortType.NO_MATCH]?: string;
    [BaseModels.PortType.NO_REPLY]?: string;
  }

  export interface Command extends Command.PlatformData {
    name: string;
  }

  export namespace Command {
    export interface PlatformData {
      // only added some properties here
      intent: string | null;
      diagramID: string | null;
      mappings: BaseModels.SlotMapping[];
    }
  }

  export interface Capture {
    slot: string | null;
    buttons: BaseButton.AnyButton[] | null;
    noReply: Nullable<NoReply>;
    variable: string | null;
    examples: string[];
  }

  export interface CaptureBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
    [BaseModels.PortType.NO_REPLY]?: string;
  }

  export interface CaptureV2 {
    intent?: { slots: Platform.Base.Models.Intent.Slot[] };
    noReply: Nullable<NoReply>;
    noMatch: Nullable<NoMatch>;
    variable: Nullable<string>;
    captureType: BaseNode.CaptureV2.CaptureType;
    intentScope?: BaseNode.Utils.IntentScope;
    utterancesShown?: boolean;
  }

  export interface CaptureV2BuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
    [BaseModels.PortType.NO_MATCH]?: string;
    [BaseModels.PortType.NO_REPLY]?: string;
  }

  export interface Speak {
    dialogs: SpeakData[];
    randomize: boolean;
    canvasVisibility?: BaseNode.Utils.CanvasNodeVisibility;
  }

  export interface SpeakBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }

  export interface Card {
    cardType: BaseNode.Card.CardType;
    title: string;
    content: string;
    hasSmallImage: boolean;
    largeImage: string | null;
    smallImage: string | null;
  }

  export interface CardBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }

  export namespace Carousel {
    export type Card = BaseNode.Carousel.CarouselCard;
    export type Button = BaseNode.Carousel.CarouselButton;
  }
  export interface Carousel extends Omit<VoiceflowNode.Carousel.StepData, 'noMatch' | 'noReply'> {
    noMatch: Nullable<NoMatch>;
    noReply: Nullable<NoReply>;
  }
  export interface CarouselBuiltInPorts {
    [BaseModels.PortType.NO_MATCH]?: string;
    [BaseModels.PortType.NO_REPLY]?: string;
    [BaseModels.PortType.NEXT]?: string;
  }
  export namespace CardV2 {
    export type Button = BaseNode.CardV2.CardV2Button;
  }
  export interface CardV2 extends Omit<VoiceflowNode.CardV2.StepData, 'noMatch' | 'noReply'> {
    noMatch: Nullable<NoMatch>;
    noReply: Nullable<NoReply>;
  }
  export interface CardV2BuiltInPorts {
    [BaseModels.PortType.NO_MATCH]?: string;
    [BaseModels.PortType.NO_REPLY]?: string;
    [BaseModels.PortType.NEXT]?: string;
  }

  export interface VariableMapping {
    to: string | null;
    from: string | null;
  }

  export interface FlowBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }

  export interface Component {
    diagramID: string | null;
    inputs?: VariableMapping[];
    outputs?: VariableMapping[];
  }

  export interface ComponentBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }

  export interface ReminderRecurrence {
    byDay?: string;
    freq: AlexaNode.Reminder.RecurrenceFreq;
  }

  export interface Reminder {
    name: string;
    reminderType: string;
    text: string;
    hours: string;
    minutes: string;
    seconds: string;
    date?: string;
    timezone?: string;
    recurrence?: ReminderRecurrence;
    recurrenceBool: boolean;
  }

  export interface ReminderBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
    [BaseModels.PortType.FAIL]: string;
  }

  export interface UserInfoPermission {
    id: string;
    mapTo: string | null;
    product: string | null;
    selected: AlexaNode.PermissionType | null;
  }

  export interface UserInfo {
    permissions: UserInfoPermission[];
  }

  export interface UserInfoBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
    [BaseModels.PortType.FAIL]: string;
  }

  export type NewExpressionType = string | number | null;

  export interface SetExpressionV2 {
    expression: NewExpressionType;
    id: string;
    variable?: string | null;
    type: BaseNode.Utils.ExpressionTypeV2;
  }

  export interface SetV2 {
    title?: string;
    sets: SetExpressionV2[];
  }

  export interface SetV2BuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }

  export interface IfV2 {
    expressions: ExpressionData[];
    noMatch: BaseNode.IfV2.IfNoMatch;
  }

  export interface IfV2BuiltInPorts {
    [BaseModels.PortType.NO_MATCH]?: string;
  }

  export interface Directive {
    directive: any;
  }

  export interface DirectiveBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }

  export interface CustomPayload {
    customPayload: any;
  }

  export interface CustomPayloadBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }

  export enum TraceBodyType {
    JSON = 'json',
    TEXT = 'text',
  }

  export enum TraceScope {
    LOCAL = 'local',
    GLOBAL = 'global',
  }

  export interface Trace {
    name: string;
    body: string;
    bodyType: TraceBodyType;
    scope: TraceScope;
    paths: { label: string; isDefault?: boolean }[];
    isBlocking: boolean;
  }

  export interface Stream {
    loop: boolean;
    audio: string;
    title: string | null;
    iconImage: string | null;
    customPause: boolean;
    description: string | null;
    backgroundImage: string | null;
  }

  export interface StreamBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
    [BaseModels.PortType.PAUSE]?: string;
    [BaseModels.PortType.PREVIOUS]?: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface AccountLinking {}

  export interface AccountLinkingBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }

  export type Intent = Intent.PlatformData;

  export interface IntentBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }
  export namespace Intent {
    export interface PlatformData {
      intent: string | null;
      mappings: BaseModels.SlotMapping[];
      availability: BaseNode.Intent.IntentAvailability;
    }
  }

  export interface Event {
    requestName: string;
    mappings: {
      path: string;
      var: string | null;
    }[];
  }

  export interface EventBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }
  export interface IntegrationDefaultProps {
    selectedAction?: string;
    selectedIntegration: string;
  }

  export interface CustomApi extends IntegrationDefaultProps {
    url?: string;
    tls?: Nullable<{ cert: string | null; key: string | null }>;
    body?: BaseNode.Api.APIKeyVal[];
    headers?: BaseNode.Api.APIKeyVal[];
    mapping?: { path: string; var: string | null; index?: number }[];
    content?: string;
    parameters?: BaseNode.Api.APIKeyVal[];
    bodyInputType?: BaseNode.Api.APIBodyType;
    selectedIntegration: BaseNode.Utils.IntegrationType.CUSTOM_API;
  }

  export type Integration = CustomApi;

  export interface IntegrationBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
    [BaseModels.PortType.FAIL]: string;
  }

  export interface TypedIntegration {
    [BaseNode.Utils.IntegrationType.CUSTOM_API]: CustomApi;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Exit {}

  export interface Buttons extends Omit<VoiceflowNode.Buttons.StepData, 'else' | 'noMatch' | 'reprompt' | 'noReply' | 'diagramID'> {
    noMatch: Nullable<NoMatch>;
    noReply: Nullable<NoReply>;
  }

  export interface ButtonsBuiltInPorts {
    [BaseModels.PortType.NO_MATCH]?: string;
    [BaseModels.PortType.NO_REPLY]?: string;
  }

  export interface Text extends BaseNode.Text.StepData {}

  export interface TextBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }

  export interface AIResponse extends VoiceNode.AIResponse.StepData<string> {}

  export interface AIResponseBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
    [BaseModels.PortType.NO_MATCH]?: string;
  }

  export interface AISet extends BaseNode.AISet.StepData {}

  export interface AISetBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }

  // union
  export type Visual = BaseNode.Visual.StepData;

  export interface VisualBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }

  export interface GoToNode {
    diagramID?: Nullable<string>;
    // can't use just nodeID since it conflicts with the nodeID of the node
    goToNodeID?: Nullable<string>;
  }

  export interface GoToIntent {
    intent?: Nullable<string>;
    diagramID?: Nullable<string>;
  }

  export interface GoToDomain {
    domainID?: Nullable<string>;
  }

  export interface Url {
    url: string;
  }

  export interface UrlBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }

  /**
   * Defines the Pointer block type. It can be helpful to think of this as a "function pointer"
   */
  export interface Pointer {
    /**
     * ID of the base block that this pointer points to. As an analogy, this essentially
     * specifies the "base class" that this pointer "subclass" inherits from.
     */
    sourceID: string;

    /**
     * Type of the base block that the Pointer points. As an analogy, this is essentially
     * the type `T` in the pointer type `T*`
     */
    pointedType: BlockType;

    /**
     * The list of values passed in as arguments to this Pointer block.
     */
    parameters: Record<string, any>;

    /**
     * The name for this reusable Pointer block, assigned by the developer of this
     * Pointer block.
     */
    pointerName: string;
  }

  export type Function = Omit<FunctionNode['data'], 'portsV2'>;
}

export interface NodeDataMap {
  [BlockType.START]: NodeData.Start;
  [BlockType.COMBINED]: NodeData.Combined;
  [BlockType.COMMAND]: NodeData.Command;
  [BlockType.COMMENT]: unknown;
  [BlockType.ACTIONS]: NodeData.Actions;

  [BlockType.TEXT]: NodeData.Text;
  [BlockType.SPEAK]: NodeData.Speak;
  [BlockType.AI_RESPONSE]: NodeData.AIResponse;
  [BlockType.AI_SET]: NodeData.AISet;
  [BlockType.CHOICE_OLD]: unknown;

  [BlockType.EXIT]: NodeData.Exit;
  [BlockType.GO_TO_NODE]: NodeData.GoToNode;
  [BlockType.GO_TO_INTENT]: NodeData.GoToIntent;
  [BlockType.GO_TO_DOMAIN]: NodeData.GoToDomain;

  [BlockType.SET]: unknown;
  [BlockType.SETV2]: NodeData.SetV2;
  [BlockType.IF]: unknown;
  [BlockType.IFV2]: NodeData.IfV2;
  [BlockType.RANDOM]: NodeData.Random;
  [BlockType.RANDOMV2]: NodeData.RandomV2;
  [BlockType.URL]: NodeData.Url;

  [BlockType.CHOICE]: NodeData.Interaction;
  [BlockType.BUTTONS]: NodeData.Buttons;
  [BlockType.CAPTURE]: NodeData.Capture;
  [BlockType.CAPTUREV2]: NodeData.CaptureV2;
  [BlockType.INTENT]: NodeData.Intent;
  [BlockType.STREAM]: NodeData.Stream;
  [BlockType.INTEGRATION]: NodeData.Integration;
  [BlockType.COMPONENT]: NodeData.Component;
  [BlockType.CODE]: NodeData.Code;
  [BlockType.PROMPT]: NodeData.Prompt;
  [BlockType.TRACE]: NodeData.Trace;
  [BlockType.CUSTOM_BLOCK_POINTER]: NodeData.Pointer;

  [BlockType.CARD]: NodeData.Card;
  [BlockType.CAROUSEL]: NodeData.Carousel;
  [BlockType.CARDV2]: NodeData.CardV2;
  [BlockType.VISUAL]: NodeData.Visual;
  [BlockType.DISPLAY]: unknown;

  [BlockType.PERMISSION]: NodeData.Permission;
  [BlockType.ACCOUNT_LINKING]: NodeData.AccountLinking;
  [BlockType.USER_INFO]: NodeData.UserInfo;
  [BlockType.REMINDER]: NodeData.Reminder;
  [BlockType.DEPRECATED]: NodeData.Deprecated;
  [BlockType.INVALID_PLATFORM]: unknown;

  // TODO
  [BlockType.DEPRECATED_CUSTOM_PAYLOAD]: unknown;
  [BlockType.PAYLOAD]: unknown;

  [BlockType.DIRECTIVE]: NodeData.Directive;
  [BlockType.EVENT]: NodeData.Event;

  [BlockType.MARKUP_TEXT]: Markup.NodeData.Text;
  [BlockType.MARKUP_IMAGE]: Markup.NodeData.Image;
  [BlockType.MARKUP_VIDEO]: Markup.NodeData.Video;
  [BlockType.FUNCTION]: NodeData.Function;
}
