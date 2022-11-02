import * as NLP from '@/config/nlp';

import { NLUType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLUType.VOICEFLOW,

  name: 'Voiceflow (default)',

  icon: NLP.Voiceflow.CONFIG.icon,

  nlps: [NLP.Voiceflow.CONFIG, ...NLP.Config.getAll().filter((nlp) => nlp !== NLP.Voiceflow.CONFIG)],

  tooltip: {
    title: 'Voiceflow NLU',
    description: "If you don't already use one of these NLU providers, we recommend this option for the simplest experience.",
  },

  planType: null,
});

export type Config = typeof CONFIG;
