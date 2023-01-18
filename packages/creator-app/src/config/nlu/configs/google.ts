import * as Platform from '@voiceflow/platform-config';

import * as NLP from '@/config/nlp';
import { Permission } from '@/constants/permissions';

import * as Base from './base';

export const CONFIG = Base.extend({
  is: Platform.Utils.TypeGuards.isValueFactory(Platform.Constants.NLUType.GOOGLE),

  type: Platform.Constants.NLUType.GOOGLE,

  name: 'Google',

  icon: Platform.Google.CONFIG.types.voice.icon,

  nlps: [NLP.DialogflowES.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.DialogflowES.CONFIG),

  permission: Permission.NLU_CUSTOM,

  helpURL: 'https://voiceflow.zendesk.com/hc/en-us/articles/9499645120781-Dialogflow-ES-Imports-Exports',
})(Base.validate);

export type Config = typeof CONFIG;
