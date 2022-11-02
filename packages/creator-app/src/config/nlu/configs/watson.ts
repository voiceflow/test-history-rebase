import { PlanType } from '@voiceflow/internal';

import * as NLP from '@/config/nlp';

import { NLUType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLUType.WATSON,

  name: 'IBM Watson',

  icon: NLP.Watson.CONFIG.icon,

  nlps: [NLP.Watson.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.Watson.CONFIG),

  planType: PlanType.ENTERPRISE,
});

export type Config = typeof CONFIG;
