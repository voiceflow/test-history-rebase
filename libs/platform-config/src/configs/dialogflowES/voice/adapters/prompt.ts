import * as Common from '@platform-config/configs/common';
import { GoogleConstants } from '@voiceflow/google-types';

export const simple = Common.Voice.Adapters.Prompt.simpleFactory<GoogleConstants.Voice>();

export const CONFIG = Common.Voice.Adapters.Prompt.extend({
  simple,
})(Common.Voice.Adapters.Prompt.validate);

export type Config = typeof CONFIG;
