import { PlanType } from '@voiceflow/internal';

import * as NLP from '@/config/nlp';

import { NLUType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLUType.LUIS,

  name: 'Microsoft Luis',

  icon: NLP.Luis.CONFIG.icon,

  nlps: [NLP.Luis.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.Luis.CONFIG),

  planType: PlanType.ENTERPRISE,
});

export type Config = typeof CONFIG;
