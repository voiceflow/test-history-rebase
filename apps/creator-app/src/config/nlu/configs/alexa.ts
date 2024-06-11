import * as Platform from '@voiceflow/platform-config';

import * as NLP from '@/config/nlp';
import { Permission } from '@/constants/permissions';

import * as Base from './base';

export const CONFIG = Base.extend({
  is: Platform.Utils.TypeGuards.isValueFactory(Platform.Constants.NLUType.ALEXA),

  type: Platform.Constants.NLUType.ALEXA,

  name: 'Amazon Alexa',

  icon: NLP.Alexa.CONFIG.icon,

  nlps: [NLP.Alexa.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.Alexa.CONFIG),

  permission: Permission.FEATURE_NLU_CUSTOM,

  helpURL: 'https://voiceflow.zendesk.com/hc/en-us/articles/10827996837773',
})(Base.validate);

export type Config = typeof CONFIG;
