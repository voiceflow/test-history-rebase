import type * as Base from '@platform-config/configs/base';
import type { Nullable } from '@voiceflow/common';

import * as Publishing from './publishing';
import * as Settings from './settings';

export { Publishing, Settings };

export interface SessionResumePrompt<Voice extends string = string> {
  voice: Nullable<Voice>;
  content: string;
  followVoice: Nullable<Voice>;
  followContent: Nullable<string>;
}

export interface Session<Voice extends string = string> extends Base.Models.Version.Session {
  resumePrompt: SessionResumePrompt<Voice>;
}

export interface Model<Voice extends string = string> extends Base.Models.Version.Model {
  session: Session<Voice>;
  settings: Settings.Model<Voice>;
  publishing: Publishing.Model;
}
