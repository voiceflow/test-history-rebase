import * as Platform from '@voiceflow/platform-config';

import * as NLP from '@/config/nlp';

import * as Base from './base';

export const CONFIG = Base.extend({
  is: Platform.Utils.TypeGuards.isValueFactory(Platform.Constants.NLUType.LEX),

  type: Platform.Constants.NLUType.LEX,

  name: 'Amazon Lex',

  icon: NLP.LexV1.CONFIG.icon,

  nlps: [NLP.LexV1.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.LexV1.CONFIG),

  helpURL: 'https://voiceflow.zendesk.com/hc/en-us/articles/10827936879629',
})(Base.validate);

export type Config = typeof CONFIG;
