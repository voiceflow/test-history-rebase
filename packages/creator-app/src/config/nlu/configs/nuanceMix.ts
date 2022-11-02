import { PlanType } from '@voiceflow/internal';

import * as NLP from '@/config/nlp';

import { NLUType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLUType.NUANCE_MIX,

  name: 'Nuance Mix',

  icon: NLP.NuanceMix.CONFIG.icon,

  nlps: [NLP.NuanceMix.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.NuanceMix.CONFIG),

  planType: PlanType.ENTERPRISE,
});

export type Config = typeof CONFIG;
