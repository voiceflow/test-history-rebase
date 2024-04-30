import type { Nullable } from '@voiceflow/common';

import type * as Base from '@/configs/base';

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
