import * as Common from '@platform-config/configs/common';

import * as Publishing from './publishing';
import * as Settings from './settings';

export { Publishing, Settings };

export interface Session extends Common.Chat.Models.Version.Session {}

export interface Model extends Common.Chat.Models.Version.Model {
  status: null;
  settings: Settings.Model;
  publishing: Publishing.Model;
}
