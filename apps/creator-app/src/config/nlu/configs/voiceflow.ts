import * as Platform from '@voiceflow/platform-config';

import * as NLP from '@/config/nlp';

import * as Base from './base';

export const CONFIG = Base.extend({
  is: Platform.Utils.TypeGuards.isValueFactory(Platform.Constants.NLUType.VOICEFLOW),

  type: Platform.Constants.NLUType.VOICEFLOW,

  name: 'Voiceflow',

  icon: NLP.Voiceflow.CONFIG.icon,

  nlps: [NLP.Voiceflow.CONFIG, ...NLP.Config.getAll().filter((nlp) => nlp !== NLP.Voiceflow.CONFIG)],

  tooltip: {
    title: 'Voiceflow NLU',
    description:
      "If you don't already use one of these NLU providers, we recommend this option for the simplest experience.",
  },

  helpURL: 'https://voiceflow.zendesk.com/hc/en-us/articles/10587264500877',
})(Base.validate);

export type Config = typeof CONFIG;
