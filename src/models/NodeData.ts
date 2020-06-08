import {
  BlockType,
  CardType,
  ChoiceElseType,
  DialogType,
  DisplayType,
  ExpressionType,
  IntegrationType,
  PermissionType,
  PlatformType,
  RepromptType,
} from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import { UserType } from '@/models/Integration';
import { SpeakData } from '@/models/Speak';

export type NodeData<T> = T & {
  nodeID: string;
  name: string;
  type: BlockType;
  path: unknown[];
  blockColor: BlockVariant;
  deprecatedType?: string;
};

export namespace NodeData {
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

  export type Interaction = {
    choices: Record<
      PlatformType,
      {
        id: string;
        intent: string | null;
        mappings: { variable: string | null; slot: string | null }[];
      }
    >[];
    else: {
      type: ChoiceElseType;
      randomize: boolean;
      reprompts: SpeakData[];
    };
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
    variable: string | null;
    slot: string | null;
  };

  export type Speak = {
    randomize: boolean;
    dialogs: {
      content?: string;
      id: string;
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
  };

  export type Reminder = {
    text: string;
  };

  export type UserInfo = {
    permissions: {
      id: string;
      selected: PermissionType | null;
      mapTo: string | null;
      product: string | null;
    }[];
  };

  export type Expression = {
    depth: number;
    id: string;
    type: ExpressionType;
    value: Expression[] | string | null;
  };

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
    audio: string;
    iconImage: string | null;
    backgroundImage: string | null;
    customPause: boolean;
    loop: boolean;
  };

  export type If = {
    expressions: {
      depth: number;
      id: string;
      type: ExpressionType;
      value: Expression[] | string | null;
    }[];
  };

  export type Intent = Record<PlatformType, { intent: string | null; mappings: unknown[] }>;

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
    selectedIntegration: T;
    selectedAction?: string;
  };

  export type CustomApi = IntegrationDefaultProps<IntegrationType.CUSTOM_API> & {
    headers?: { key: [] | string; val: string }[];
    url?: string;
    mapping?: { path: string | []; var: string | null }[];
    bodyInputData?: string;
    body?: { key: string | []; val: string }[];
    parameters?: { key: string | []; val: string }[];
    content?: string;
  };

  export type GoogleSheets = IntegrationDefaultProps<IntegrationType.GOOGLE_SHEETS> & {
    user?: {};
    spreadsheet?: { value: string; label: string } | null;
    sheet?: { value: string; label: string } | null;
    header_column?: string | null;
    match_value?: [];
    row_value?: [];
    row_number?: [];
    mapping?: { path: string | []; var: string }[];
    start_row?: [];
    end_row?: [];
  };

  export type Zapier = IntegrationDefaultProps<IntegrationType.ZAPIER> & {
    user?: UserType;
    value?: [] | string;
  };

  export type Integration = CustomApi | GoogleSheets | Zapier;

  export type TypedIntegration = {
    [IntegrationType.ZAPIER]: Zapier;
    [IntegrationType.CUSTOM_API]: CustomApi;
    [IntegrationType.GOOGLE_SHEETS]: GoogleSheets;
  };
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
