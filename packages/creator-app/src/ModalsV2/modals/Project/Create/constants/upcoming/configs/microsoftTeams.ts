import * as Platform from '@voiceflow/platform-config';

import { PlatformType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  ...Platform.MicrosoftTeams.CONFIG,

  type: PlatformType.MICROSOFT_TEAMS,
});

export type Config = typeof CONFIG;
