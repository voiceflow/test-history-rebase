import * as Base from '@platform-config/configs/base';

import * as Prompt from '../prompt';
import * as Publishing from './publishing';
import * as Settings from './settings';

export { Publishing, Settings };

export interface Session extends Base.Models.Version.Session {
  resumePrompt: {
    resume: Prompt.Model;
    follow: Prompt.Model;
  };
}

export interface Model extends Base.Models.Version.Model {
  session: Session;
  settings: Settings.Model;
  publishing: Publishing.Model;
}
