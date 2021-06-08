import { PermissionType } from '@voiceflow/alexa-types';
import { RecurrenceFreq } from '@voiceflow/alexa-types/build/nodes/reminder';
import { SlotMapping } from '@voiceflow/api-sdk';
import { CanvasNodeVisibility, Chip, ExpressionTypeV2, IntegrationUser } from '@voiceflow/general-types';
import { APIBodyType, APIKeyVal } from '@voiceflow/general-types/build/nodes/api';
import { GoogleSheetsMapping, GoogleSheetsSpreadsheet, GoogleSheetsValueLabel } from '@voiceflow/general-types/build/nodes/googleSheets';
import { ElseType as InteractionElseType } from '@voiceflow/general-types/build/nodes/interaction';
import { StepData as VisualStepData } from '@voiceflow/general-types/build/nodes/visual';

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
  export type Start = {
    name: string;
    blockColor: BlockVariant;
  };

  export type Combined = {
    name: string;
    blockColor: BlockVariant;
  };

  export type Code = {
    code: string;
  };

  export type Deprecated = {
    deprecatedType: string;
  } & Record<string, unknown>;

  export type Random = {
    paths: number;
    noDuplicates: boolean;
  };

  export type Permission = {
    permissions: string[];
  };

  export type NoMatches = {
    randomize: boolean;
    reprompts: SpeakData[];
  };

  export type InteractionChoice = {
    id: string;
    intent: string | null;
    mappings: SlotMapping[];
  };

  export type InteractionElse = NoMatches & { type: InteractionElseType };

  export type Interaction = {
    name: string;
    else: InteractionElse;
    choices: Record<DistinctPlatform, InteractionChoice>[];
    reprompt: Reprompt | null;
    chips: Chip[] | null;
  };

  export type ChoiceOld = {
    choices: { synonyms: string[] }[];
    reprompt: Reprompt | null;
  };

  export type Prompt = {
    noMatchReprompt: {
      randomize: boolean;
      reprompts: SpeakData[];
    };
    reprompt: Reprompt | null;
    chips: Chip[] | null;
  };

  export type Command = Record<DistinctPlatform, Command.PlatformData> & { name: string };
  export namespace Command {
    export type PlatformData = {
      // only added some properties here
      intent: string | null;
      diagramID: string | null;
      mappings: SlotMapping[];
    };
  }

  export type Reprompt = {
    type: RepromptType;
    content: string;
    audio?: string | null;
    voice?: string | null;
  };

  export type Capture = {
    slot: string | null;
    variable: string | null;
    examples: string[];
    reprompt: Reprompt | null;
    chips: Chip[] | null;
  };

  export type Speak = {
    randomize: boolean;
    dialogs: SpeakData[];
    canvasVisibility?: CanvasNodeVisibility;
  };

  export type Card = {
    cardType: CardType;
    title: string;
    content: string;
    hasSmallImage: boolean;
    largeImage: string | null;
    smallImage: string | null;
  };

  export type Flow = {
    diagramID: string | null;
    inputs?: { from: string | null; to: string | null }[];
    outputs?: { from: string | null; to: string | null }[];
  };

  export type Reminder = {
    name: string;
    reminderType: string;
    text: string;
    hours: string;
    minutes: string;
    seconds: string;
    date?: string;
    timezone?: string;
    recurrence?: { byDay?: string; freq: RecurrenceFreq };
    recurrenceBool: boolean;
  };

  export type UserInfoPermission = {
    id: string;
    mapTo: string | null;
    product: string | null;
    selected: PermissionType | null;
  };

  export type UserInfo = {
    permissions: UserInfoPermission[];
  };

  export type SetExpression = {
    expression: Expression;
    id: string;
    variable?: string | null;
    type?: ExpressionTypeV2;
  };

  export type Set = {
    title?: string;
    sets: SetExpression[];
  };

  export type NewExpressionType = string | number | null;

  export type SetExpressionV2 = {
    expression: NewExpressionType;
    id: string;
    variable?: string | null;
    type: ExpressionTypeV2;
  };

  export type SetV2 = {
    title?: string;
    sets: SetExpressionV2[];
  };

  export type If = {
    expressions: Expression[];
  };

  export type IfV2 = {
    expressions: ExpressionData[];
  };

  export type Directive = {
    directive: any;
  };

  export type Trace = {
    name: string;
    body: string;
    paths: { label: string; isDefault?: boolean }[];
  };

  export type Stream = {
    loop: boolean;
    audio: string;
    title: string | null;
    iconImage: string | null;
    customPause: boolean;
    description: string | null;
    backgroundImage: string | null;
  };

  export type AccountLinking = {};

  export type Intent = Record<DistinctPlatform, Intent.PlatformData>;

  export namespace Intent {
    export type PlatformData = { intent: string | null; mappings: SlotMapping[] };
  }

  export type Event = {
    requestName: string;
    mappings: {
      path: string;
      var: string | null;
    }[];
  };

  export type Payment = {
    productID: string | null;
  };

  export type CancelPayment = {
    productID: string | null;
  };

  export type IntegrationDefaultProps<T extends IntegrationType> = {
    selectedAction?: string;
    selectedIntegration: T;
  };

  export type CustomApi = IntegrationDefaultProps<IntegrationType.CUSTOM_API> & {
    url?: string;
    body?: APIKeyVal[];
    headers?: APIKeyVal[];
    mapping?: { path: string; var: string | null; index?: number }[];
    content?: string;
    parameters?: APIKeyVal[];
    bodyInputType?: APIBodyType;
  };

  export type GoogleSheets = IntegrationDefaultProps<IntegrationType.GOOGLE_SHEETS> & {
    user?: IntegrationUser;
    sheet?: GoogleSheetsValueLabel | null;
    mapping?: GoogleSheetsMapping[];
    end_row?: string;
    start_row?: string;
    row_values?: string[];
    row_number?: string;
    spreadsheet: GoogleSheetsSpreadsheet | null;
    match_value?: string;
    header_column?: GoogleSheetsValueLabel | null;
  };

  export type Zapier = IntegrationDefaultProps<IntegrationType.ZAPIER> & {
    user?: IntegrationUser;
    value?: string;
  };

  export type Integration = CustomApi | GoogleSheets | Zapier;

  export type TypedIntegration = {
    [IntegrationType.ZAPIER]: Zapier;
    [IntegrationType.CUSTOM_API]: CustomApi;
    [IntegrationType.GOOGLE_SHEETS]: GoogleSheets;
  };

  export type Exit = {};

  export type Visual = VisualStepData;
}

export namespace DBNodeData {
  export type Reprompt = {
    type: string;
    voice?: string;
    content?: string;
  };

  export type Prompt = {
    noMatchReprompt: {
      randomize: boolean;
      reprompts: SpeakData[];
    };
    reprompt: Reprompt | null;
  };
}
