import * as Base from '@platform-config/configs/base';
import { Nullable } from '@voiceflow/common';

export enum PromptType {
  TEXT = 'text',
  AUDIO = 'audio',
}

export interface Model<Voice extends string = string> extends Base.Models.Prompt.Model {
  type: PromptType;
  desc?: Nullable<string>;
  audio?: Nullable<string>;
  voice?: Nullable<Voice>;
  content: string;
}
