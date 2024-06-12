import * as Platform from '@voiceflow/platform-config';

import * as NLP from '@/config/nlp';
import { Permission } from '@/constants/permissions';

import * as Base from './base';

export const CONFIG = Base.extend({
  is: Platform.Utils.TypeGuards.isValueFactory(Platform.Constants.NLUType.LUIS),

  type: Platform.Constants.NLUType.LUIS,

  name: 'Microsoft Luis',

  icon: NLP.Luis.CONFIG.icon,

  nlps: [NLP.Luis.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.Luis.CONFIG),

  permission: Permission.FEATURE_NLU_CUSTOM,

  helpURL: 'https://voiceflow.zendesk.com/hc/en-us/articles/10827676794125',
})(Base.validate);

export type Config = typeof CONFIG;
