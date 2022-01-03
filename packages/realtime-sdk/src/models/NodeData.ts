/* eslint-disable @typescript-eslint/no-empty-interface */
import { BlockType, BlockVariant, DistinctPlatform, VoicePromptType } from '@realtime-sdk/constants';
import { Node as AlexaNode } from '@voiceflow/alexa-types';
import { Button, Models as BaseModels, Node as BaseNode } from '@voiceflow/base-types';
import { Node as ChatNode, Types as ChatTypes } from '@voiceflow/chat-types';
import { Nullable } from '@voiceflow/common';
import { Node as GeneralNode } from '@voiceflow/general-types';
import { Node as VoiceNode } from '@voiceflow/voice-types';

import { ExpressionData } from './Expression';
import { IntentSlot } from './Intent';
import { SpeakData } from './Speak';

export type NodeData<T> = T & {
  nodeID: string;
  name: string;
  type: BlockType;
  path: unknown[];
  deprecatedType?: string;
};

export type BlockNodeData<T> = NodeData<T> & {
  blockColor: BlockVariant;
};

export namespace NodeData {
  // TODO: replace it with VoiceNode.Utils.StepNoReply<any> type
  export interface VoicePrompt {
    id: string;
    type: VoicePromptType;
    desc?: string | null;
    audio?: string | null;
    voice?: string | null;
    content: string;
  }

  export interface VoiceNoReply extends Omit<VoiceNode.Utils.StepNoReply<any>, 'reprompts'> {
    reprompts?: VoicePrompt[];
  }

  // TODO: refactor node data types to be platform specific instead of unions
  export type NoReply = VoiceNoReply | ChatNode.Utils.StepNoReply;

  export interface BaseNoMatch {
    types: BaseNode.Utils.NoMatchType[];
    pathName: string;
    randomize: boolean;
  }

  export interface VoiceNoMatch extends BaseNoMatch {
    reprompts: VoicePrompt[];
  }

  export interface ChatNoMatch extends BaseNoMatch {
    reprompts: ChatTypes.Prompt[];
  }

  export type NoMatch = VoiceNoMatch | ChatNoMatch;

  export interface Start {
    name: string;
    label: string;
    blockColor: BlockVariant;
  }

  export interface Combined {
    name: string;
    blockColor: BlockVariant;
  }

  export interface Code {
    code: string;
  }

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

  export interface Permission {
    permissions: string[];
  }

  export interface PermissionBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }

  export interface InteractionChoice {
    id: string;
    goTo: Nullable<{ intentID: Nullable<string> }>;
    action: BaseNode.Interaction.ChoiceAction;
    intent: string | null;
    mappings: BaseModels.SlotMapping[];
  }

  export interface Interaction {
    name: string;
    else: NoMatch;
    choices: Record<DistinctPlatform, InteractionChoice>[];
    buttons: Button.AnyButton[] | null;
    noReply: Nullable<NoReply>;
  }

  export interface InteractionBuiltInPorts {
    [BaseModels.PortType.NO_MATCH]: string;
    [BaseModels.PortType.NO_REPLY]?: string;
  }

  export interface ChoiceOld {
    choices: { synonyms: string[] }[];
    noReply: Nullable<NoReply>;
  }

  export interface Prompt {
    buttons: Button.AnyButton[] | null;
    noReply: Nullable<NoReply>;
    noMatchReprompt: NoMatch;
  }

  export interface PromptBuiltInPorts {
    [BaseModels.PortType.NO_MATCH]: string;
    [BaseModels.PortType.NO_REPLY]?: string;
  }

  export type Command = Record<DistinctPlatform, Command.PlatformData> & { name: string };
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
    buttons: Button.AnyButton[] | null;
    noReply: Nullable<NoReply>;
    variable: string | null;
    examples: string[];
  }

  export interface CaptureBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
    [BaseModels.PortType.NO_REPLY]?: string;
  }

  export interface CaptureV2 {
    captureType: BaseNode.CaptureV2.CaptureType;
    variable: Nullable<string>;
    intent?: { slots: IntentSlot[] };
    noReply: Nullable<NoReply>;
    noMatch: Nullable<NoMatch>;
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

  export interface VariableMapping {
    to: string | null;
    from: string | null;
  }

  export interface Flow {
    diagramID: string | null;
    inputs?: VariableMapping[];
    outputs?: VariableMapping[];
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
    [BaseModels.PortType.NO_MATCH]: string;
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

  export interface Trace {
    name: string;
    body: string;
    paths: { label: string; isDefault?: boolean }[];
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

  export interface AccountLinking {}

  export interface AccountLinkingBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }

  export type Intent = Record<DistinctPlatform, Intent.PlatformData>;

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

  export interface Payment {
    productID: string | null;
  }

  export interface PaymentBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
    [BaseModels.PortType.FAIL]: string;
  }

  export interface CancelPayment {
    productID: string | null;
  }

  export interface CancelPaymentBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
    [BaseModels.PortType.FAIL]: string;
  }

  export interface IntegrationDefaultProps {
    selectedAction?: string;
    selectedIntegration: string;
  }

  export interface CustomApi extends IntegrationDefaultProps {
    url?: string;
    body?: BaseNode.Api.APIKeyVal[];
    headers?: BaseNode.Api.APIKeyVal[];
    mapping?: { path: string; var: string | null; index?: number }[];
    content?: string;
    parameters?: BaseNode.Api.APIKeyVal[];
    bodyInputType?: BaseNode.Api.APIBodyType;
    selectedIntegration: BaseNode.Utils.IntegrationType.CUSTOM_API;
  }

  /* eslint-disable camelcase */
  export interface GoogleSheets extends IntegrationDefaultProps {
    user?: BaseNode.Utils.IntegrationUser;
    sheet?: BaseNode.GoogleSheets.GoogleSheetsValueLabel | null;
    mapping?: BaseNode.GoogleSheets.GoogleSheetsMapping[];
    end_row?: string;
    start_row?: string;
    row_values?: string[];
    row_number?: string;
    spreadsheet: BaseNode.GoogleSheets.GoogleSheetsSpreadsheet | null;
    match_value?: string;
    header_column?: BaseNode.GoogleSheets.GoogleSheetsValueLabel | null;
    selectedIntegration: BaseNode.Utils.IntegrationType.GOOGLE_SHEETS;
  }
  /* eslint-enable camelcase */

  export interface Zapier extends IntegrationDefaultProps {
    user?: BaseNode.Utils.IntegrationUser;
    value?: string;
    selectedIntegration: BaseNode.Utils.IntegrationType.ZAPIER;
  }

  export type Integration = CustomApi | GoogleSheets | Zapier;

  export interface IntegrationBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
    [BaseModels.PortType.FAIL]: string;
  }

  export interface TypedIntegration {
    [BaseNode.Utils.IntegrationType.ZAPIER]: Zapier;
    [BaseNode.Utils.IntegrationType.CUSTOM_API]: CustomApi;
    [BaseNode.Utils.IntegrationType.GOOGLE_SHEETS]: GoogleSheets;
  }

  export interface Exit {}

  export interface Buttons extends Omit<GeneralNode.Buttons.StepData, 'else' | 'reprompt' | 'noReply'> {
    else: NoMatch;
    noReply: Nullable<NoReply>;
  }

  export interface ButtonsBuiltInPorts {
    [BaseModels.PortType.NO_MATCH]: string;
    [BaseModels.PortType.NO_REPLY]?: string;
  }

  export interface Text extends BaseNode.Text.StepData {}

  export interface TextBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }

  // union
  export type Visual = BaseNode.Visual.StepData;

  export interface VisualBuiltInPorts {
    [BaseModels.PortType.NEXT]: string;
  }
}
