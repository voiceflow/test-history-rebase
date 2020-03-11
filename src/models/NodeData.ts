import { PlatformType, RepromptType } from '@/constants';

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
}
