import * as Voiceflow from '@/configs/voiceflow';

import * as DialogflowCXCommon from '../common';

export const CONFIG = Voiceflow.Chat.extend({
  ...DialogflowCXCommon.Type.CONFIG,
})(Voiceflow.Chat.validate);

export type Config = typeof CONFIG;
