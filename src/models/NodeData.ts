import { CardType, DialogType, ExpressionType, PermissionType, PlatformType, RepromptType } from '@/constants';

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
}
