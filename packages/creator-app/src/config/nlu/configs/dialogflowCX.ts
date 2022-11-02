import { PlanType } from '@voiceflow/internal';

import * as NLP from '@/config/nlp';

import { NLUType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLUType.DIALOGFLOW_CX,

  name: 'Dialogflow CX',

  icon: NLP.DialogflowCX.CONFIG.icon,

  nlps: [NLP.DialogflowCX.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.DialogflowCX.CONFIG),

  planType: PlanType.ENTERPRISE,
});

export type Config = typeof CONFIG;
