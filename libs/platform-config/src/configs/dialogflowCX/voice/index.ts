import * as Voiceflow from '@platform-config/configs/voiceflow';

import * as DialogflowCXCommon from '../common';

export const CONFIG = Voiceflow.Voice.extend({
  ...DialogflowCXCommon.Type.CONFIG,
})(Voiceflow.Voice.validate);

export type Config = typeof CONFIG;
