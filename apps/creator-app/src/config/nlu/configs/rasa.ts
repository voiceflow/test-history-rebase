import * as Platform from '@voiceflow/platform-config';

import * as NLP from '@/config/nlp';

import * as Base from './base';

export const CONFIG = Base.extend({
  is: Platform.Utils.TypeGuards.isValueFactory(Platform.Constants.NLUType.RASA),

  type: Platform.Constants.NLUType.RASA,

  name: 'Rasa',

  icon: NLP.Rasa2.CONFIG.icon,

  nlps: [NLP.Rasa2.CONFIG, NLP.Rasa3.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.Rasa2.CONFIG),

  helpURL: 'https://voiceflow.zendesk.com/hc/en-us/articles/10827794283021',
})(Base.validate);

export type Config = typeof CONFIG;
