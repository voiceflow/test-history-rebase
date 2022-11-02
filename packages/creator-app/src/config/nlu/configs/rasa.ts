import { PlanType } from '@voiceflow/internal';

import * as NLP from '@/config/nlp';

import { NLUType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLUType.RASA,

  name: 'Rasa',

  icon: NLP.Rasa2.CONFIG.icon,

  nlps: [NLP.Rasa2.CONFIG, NLP.Rasa3.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.Rasa2.CONFIG),

  planType: PlanType.ENTERPRISE,
});

export type Config = typeof CONFIG;
