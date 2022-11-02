import { PlanType } from '@voiceflow/internal';

import * as NLP from '@/config/nlp';

import { NLUType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLUType.ALEXA,

  name: 'Amazon Alexa',

  icon: NLP.Alexa.CONFIG.icon,

  nlps: [NLP.Alexa.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.Alexa.CONFIG),

  planType: PlanType.ENTERPRISE,
});

export type Config = typeof CONFIG;
