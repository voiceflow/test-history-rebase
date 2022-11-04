import * as Base from '@platform/configs/base';
import { PlatformType, ProjectType } from '@platform/constants';

import * as Chat from '../chat';

export const CONFIG = Base.extend({
  type: PlatformType.WEBCHAT,

  name: 'Web Chat',

  oneClickPublish: true,

  types: {
    [ProjectType.CHAT]: Chat.CONFIG,
  },
});

export type Config = typeof CONFIG;
