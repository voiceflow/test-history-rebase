import * as Base from '@platform-config/configs/base';
import * as Voiceflow from '@platform-config/configs/voiceflow';

import * as Chat from './chat';

export const CONFIG = Base.Project.extend({
  ...Voiceflow.Common.Project.CONFIG,

  chat: Chat.CONFIG,

  noReply: false,

  name: 'WhatsApp',
})(Base.Project.validate);

export type Config = typeof CONFIG;
