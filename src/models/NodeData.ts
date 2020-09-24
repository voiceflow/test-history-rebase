import { ExpressionType, IntegrationUser, PermissionType, SlotMapping } from '@voiceflow/alexa-types';
import { APIBodyType, APIKeyVal } from '@voiceflow/alexa-types/build/nodes/api';
import { GoogleSheetsMapping, GoogleSheetsSpreadsheet, GoogleSheetsValueLabel } from '@voiceflow/alexa-types/build/nodes/googleSheets';
import { ElseType as InteractionElseType } from '@voiceflow/alexa-types/build/nodes/interaction';

import { BlockType, CardType, DialogType, DisplayType, IntegrationType, PlatformType, RepromptType } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import { SpeakData } from '@/models/Speak';

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
    blockColor: string;
  };

  export type Combined = {
    name: string;
    blockColor: string;
  };

  export type Code = {
    code: string;
  };

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
    choices: Record<PlatformType, InteractionChoice>[];
    reprompt: Reprompt | null;
  };

  export type Choice = {
    choices: { synonyms: string[] }[];
    reprompt: Reprompt | null;
  };

  export type Prompt = {
    noMatchReprompt: {
      randomize: boolean;
      reprompts: SpeakData[];
    };
    reprompt: Reprompt | null;
  };

  export type Command = Record<
    PlatformType,
    {
      // only added some properties here
      intent: string | null;
      diagramID: string | null;
    }
  >;

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
  };

  export type Speak = {
    randomize: boolean;
    dialogs: {
      content?: string;
      type: DialogType;
      voice?: string;
      url?: string;
    }[];
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
    recurrence?: { byDay?: string; freq: string };
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

  export type GenericExpression<T extends ExpressionType, V> = {
    id: string;
    type: T;
    value: V;
    depth: number;
  };

  export type ExpressionTuple = [Expression, Expression];

  // can't use generic here due tu recursion type issue
  export type NotExpression = { type: ExpressionType.NOT; value: Expression; depth: number; id: string };
  export type OrExpression = GenericExpression<ExpressionType.OR, ExpressionTuple>;
  export type AndExpression = GenericExpression<ExpressionType.AND, ExpressionTuple>;
  export type LessExpression = GenericExpression<ExpressionType.LESS, ExpressionTuple>;
  export type PlusExpression = GenericExpression<ExpressionType.PLUS, ExpressionTuple>;
  export type MinusExpression = GenericExpression<ExpressionType.MINUS, ExpressionTuple>;
  export type TimesExpression = GenericExpression<ExpressionType.TIMES, ExpressionTuple>;
  export type ValueExpression = GenericExpression<ExpressionType.VALUE, string>;
  export type DivideExpression = GenericExpression<ExpressionType.DIVIDE, ExpressionTuple>;
  export type EqualsExpression = GenericExpression<ExpressionType.EQUALS, ExpressionTuple>;
  export type GreaterExpression = GenericExpression<ExpressionType.GREATER, ExpressionTuple>;
  export type AdvancedExpression = GenericExpression<ExpressionType.ADVANCE, string>;
  export type VariableExpression = GenericExpression<ExpressionType.VARIABLE, string>;

  export type Expression =
    | NotExpression
    | OrExpression
    | AndExpression
    | LessExpression
    | PlusExpression
    | MinusExpression
    | TimesExpression
    | ValueExpression
    | DivideExpression
    | EqualsExpression
    | GreaterExpression
    | AdvancedExpression
    | VariableExpression;

  export type Set = {
    sets: {
      expression: Expression;
      id: string;
      variable?: string | null;
    }[];
  };

  export type Directive = {
    directive: any;
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

  export type If = {
    expressions: Expression[];
  };

  export type AccountLinking = {};

  export type Intent = Record<PlatformType, { intent: string | null; mappings: SlotMapping[] }>;

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

  export type Display = {
    displayType?: DisplayType;
    displayID?: string | null;
    dataSource?: string;
    aplCommands?: string;
    backgroundImage?: string | null;
    splashHeader?: string;
    jsonFileName?: string | null;
    updateOnChange?: boolean;

    /**
     * TODO: seems to be only referenced in @/store/middleware, can maybe be removed?
     */
    version?: '1';
  };

  export type IntegrationDefaultProps<T extends IntegrationType> = {
    selectedAction?: string;
    selectedIntegration: T;
  };

  export type CustomApi = IntegrationDefaultProps<IntegrationType.CUSTOM_API> & {
    url?: string;
    body?: APIKeyVal[];
    headers?: APIKeyVal[];
    mapping?: { path: string; var: string | null }[];
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
