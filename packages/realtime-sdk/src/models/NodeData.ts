/* eslint-disable @typescript-eslint/no-empty-interface */
import { Node as AlexaNode } from '@voiceflow/alexa-types';
import { Button, Models as BaseModels, Node as BaseNode } from '@voiceflow/base-types';
import { Types as ChatTypes } from '@voiceflow/chat-types';
import { Nullable } from '@voiceflow/common';
import { Node as GeneralNode } from '@voiceflow/general-types';

import { BlockType, BlockVariant, DistinctPlatform, RepromptType } from '../constants';
import { Expression, ExpressionData } from './Expression';
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

  export interface BaseNoMatches {
    type: BaseNode.Utils.NoMatchType | null;
    pathName: string;
  }

  export interface VoiceNoMatches extends BaseNoMatches {
    randomize: boolean;
    reprompts: VoicePrompt[];
  }

  export interface ChatNoMatches extends BaseNoMatches {
    randomize: boolean;
    reprompts: ChatTypes.Prompt[];
  }

  export type NoMatches = VoiceNoMatches | ChatNoMatches;

  export interface InteractionChoice {
    id: string;
    goTo: Nullable<{ intentID: Nullable<string> }>;
    action: BaseNode.Interaction.ChoiceAction;
    intent: string | null;
    mappings: BaseModels.SlotMapping[];
  }

  export interface Interaction {
    name: string;
    else: NoMatches;
    choices: Record<DistinctPlatform, InteractionChoice>[];
    reprompt: Reprompt | null;
    buttons: Button.AnyButton[] | null;
  }

  export interface ChoiceOld {
    choices: { synonyms: string[] }[];
    reprompt: Reprompt | null;
  }

  export interface Prompt {
    noMatchReprompt: NoMatches;
    reprompt: Reprompt | null;
    buttons: Button.AnyButton[] | null;
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

  export interface VoicePrompt {
    id: string;
    type: RepromptType;
    desc?: string | null;
    audio?: string | null;
    voice?: string | null;
    content: string;
  }

  // TODO: refactor node data types to be platform specific instead of unions
  export type Reprompt = VoicePrompt | ChatTypes.Prompt;

  export interface Capture {
    slot: string | null;
    variable: string | null;
    examples: string[];
    reprompt: Reprompt | null;
    buttons: Button.AnyButton[] | null;
  }

  export interface Speak {
    randomize: boolean;
    dialogs: SpeakData[];
    canvasVisibility?: BaseNode.Utils.CanvasNodeVisibility;
  }

  export interface Card {
    cardType: BaseNode.Card.CardType;
    title: string;
    content: string;
    hasSmallImage: boolean;
    largeImage: string | null;
    smallImage: string | null;
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

  export interface Component {
    diagramID: string | null;
    inputs?: VariableMapping[];
    outputs?: VariableMapping[];
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

  export interface UserInfoPermission {
    id: string;
    mapTo: string | null;
    product: string | null;
    selected: AlexaNode.PermissionType | null;
  }

  export interface UserInfo {
    permissions: UserInfoPermission[];
  }

  export interface SetExpression {
    expression: Expression;
    id: string;
    variable?: string | null;
    type?: BaseNode.Utils.ExpressionTypeV2;
  }

  export interface Set {
    title?: string;
    sets: SetExpression[];
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

  export interface If {
    expressions: Expression[];
  }

  export interface IfV2 {
    expressions: ExpressionData[];
    noMatch: BaseNoMatches;
  }

  export interface Directive {
    directive: any;
  }

  export interface CustomPayload {
    customPayload: any;
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

  export interface AccountLinking {}

  export type Intent = Record<DistinctPlatform, Intent.PlatformData>;

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

  export interface Payment {
    productID: string | null;
  }

  export interface CancelPayment {
    productID: string | null;
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

  export interface TypedIntegration {
    [BaseNode.Utils.IntegrationType.ZAPIER]: Zapier;
    [BaseNode.Utils.IntegrationType.CUSTOM_API]: CustomApi;
    [BaseNode.Utils.IntegrationType.GOOGLE_SHEETS]: GoogleSheets;
  }

  export interface Exit {}

  export interface Buttons extends Omit<GeneralNode.Buttons.StepData, 'else' | 'reprompt'> {
    else: NoMatches;
    reprompt: Reprompt | null;
  }

  export interface Text extends BaseNode.Text.StepData {}

  // union
  export type Visual = BaseNode.Visual.StepData;
}

export namespace DBNodeData {
  export interface Reprompt {
    type: string;
    voice?: string;
    content?: string;
  }

  export interface Prompt {
    noMatchReprompt: {
      randomize: boolean;
      reprompts: SpeakData[];
    };
    reprompt: Reprompt | null;
  }
}
