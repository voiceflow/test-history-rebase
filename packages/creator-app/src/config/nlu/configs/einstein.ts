import { PlanType } from '@voiceflow/internal';

import * as NLP from '@/config/nlp';

import { NLUType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLUType.EINSTEIN,

  name: 'Salesforce Einstein',

  icon: NLP.Einstein.CONFIG.icon,

  nlps: [NLP.Einstein.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.Einstein.CONFIG),

  planType: PlanType.ENTERPRISE,
});

export type Config = typeof CONFIG;
