import * as Voiceflow from '@platform-config/configs/voiceflow';

import * as DialogflowCXCommon from '../common';

export const CONFIG = Voiceflow.Chat.extend({
  ...DialogflowCXCommon.Type.CONFIG,
});

export type Config = typeof CONFIG;
