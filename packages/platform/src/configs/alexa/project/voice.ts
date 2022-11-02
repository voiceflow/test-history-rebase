import * as Base from '@platform/configs/base';
import { AlexaConstants } from '@voiceflow/alexa-types';

export const CONFIG = Base.Project.Voice.extend({
  default: AlexaConstants.Voice.ALEXA,
});

export type Config = typeof CONFIG;
