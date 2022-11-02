import { PlanType } from '@voiceflow/internal';

import * as NLP from '@/config/nlp';

import { NLUType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLUType.LEX,

  name: 'Amazon Lex',

  icon: NLP.LexV1.CONFIG.icon,

  nlps: [NLP.LexV1.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.LexV1.CONFIG),

  planType: PlanType.ENTERPRISE,
});

export type Config = typeof CONFIG;
