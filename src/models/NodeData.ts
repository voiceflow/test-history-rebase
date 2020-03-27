import { CardType, DialogType, DisplayType, ExpressionType, IntegrationType, PermissionType, PlatformType, RepromptType } from '@/constants';
import { UserType } from '@/models';

export type NodeData<T> = T & {
  nodeID: string;
  name: string;
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
    choices: {
      id: string;
      [PlatformType.ALEXA]: { intent: string };
      [PlatformType.GOOGLE]: { intent: string };
    }[];
  };

  export type Choice = {
    choices: { synonyms: string[] }[];
    reprompt: Reprompt | null;
  };

  export type Command = Record<
    PlatformType,
    {
      // only added some properties here
      intent: string | null;
      diagramID: string | undefined;
    }
  >;

  export type Reprompt = {
    type: RepromptType;
    content: string;
    audio: string | null;
    voice: string | null;
  };

  export type Capture = {
    variable?: string;
    slot?: string;
  };

  export type Speak = {
    randomize: boolean;
    dialogs: {
      content?: string;
      id: string;
      open: boolean;
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
    largeImage?: string;
    smallImage?: string;
  };

  export type Flow = {
    diagramID: string;
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
    value?: Expression[] | string;
  };

  export type Set = {
    sets: {
      expression: Expression;
      id: string;
      variable?: string;
    }[];
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
      value: If[] | string | null;
    }[];
  };

  export type Intent = {
    [PlatformType.ALEXA]: { intent: string; mappings: unknown[] };
    [PlatformType.GOOGLE]: { intent: string; mappings: unknown[] };
  };

  export type Payment = {
    productID: number | null;
  };

  export type Display = {
    displayType?: DisplayType;
    displayID?: string;
    dataSource?: string;
    aplCommands?: string;
    backgroundImage?: string;
    splashHeader?: string;
    jsonFileName?: string;
    updateOnChange?: boolean;
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
