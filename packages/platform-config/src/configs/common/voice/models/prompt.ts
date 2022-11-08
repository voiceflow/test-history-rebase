import { Nullable } from '@voiceflow/common';

export enum PromptType {
  TEXT = 'text',
  AUDIO = 'audio',
}

export interface Model<Voice extends string = string> {
  id: string;
  type: PromptType;
  desc?: Nullable<string>;
  audio?: Nullable<string>;
  voice?: Nullable<Voice>;
  content: string;
}
