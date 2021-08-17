/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Node as AlexaNode } from '@voiceflow/alexa-types';
import { SlotMapping } from '@voiceflow/api-sdk';
import { Button, Node as BaseNode } from '@voiceflow/base-types';

import { BlockType, CardType, DistinctPlatform, IntegrationType, RepromptType } from '@/constants';
import { BlockVariant } from '@/constants/canvas';

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

  export interface NoMatches {
    type: BaseNode.Utils.NoMatchType | null;
    pathName: string;
    randomize: boolean;
    reprompts: SpeakData[];
  }

  export interface InteractionChoice {
    id: string;
    intent: string | null;
    mappings: SlotMapping[];
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
      mappings: SlotMapping[];
    }
  }

  export interface Reprompt {
    type: RepromptType;
    content: string;
    audio?: string | null;
    voice?: string | null;
  }

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
    cardType: CardType;
    title: string;
    content: string;
    hasSmallImage: boolean;
    largeImage: string | null;
    smallImage: string | null;
  }

  export interface Flow {
    diagramID: string | null;
    inputs?: { from: string | null; to: string | null }[];
    outputs?: { from: string | null; to: string | null }[];
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
    recurrence?: { byDay?: string; freq: AlexaNode.Reminder.RecurrenceFreq };
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
  }

  export interface Directive {
    directive: any;
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

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface AccountLinking {}

  export type Intent = Record<DistinctPlatform, Intent.PlatformData>;

  export namespace Intent {
    export interface PlatformData {
      intent: string | null;
      mappings: SlotMapping[];
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
    selectedIntegration: IntegrationType.CUSTOM_API;
  }

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
    selectedIntegration: IntegrationType.GOOGLE_SHEETS;
  }

  export interface Zapier extends IntegrationDefaultProps {
    user?: BaseNode.Utils.IntegrationUser;
    value?: string;
    selectedIntegration: IntegrationType.ZAPIER;
  }

  export type Integration = CustomApi | GoogleSheets | Zapier;

  export interface TypedIntegration {
    [BaseNode.Utils.IntegrationType.ZAPIER]: Zapier;
    [BaseNode.Utils.IntegrationType.CUSTOM_API]: CustomApi;
    [BaseNode.Utils.IntegrationType.GOOGLE_SHEETS]: GoogleSheets;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Exit {}

  export type Visual = BaseNode.Visual.StepData;
  export type Text = BaseNode.Text.StepData;
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
