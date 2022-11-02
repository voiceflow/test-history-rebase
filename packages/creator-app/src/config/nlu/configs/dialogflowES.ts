import { PlanType } from '@voiceflow/internal';

import * as NLP from '@/config/nlp';

import { NLUType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLUType.DIALOGFLOW_ES,

  name: 'Dialogflow ES',

  icon: NLP.DialogflowES.CONFIG.icon,

  nlps: [NLP.DialogflowES.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.DialogflowES.CONFIG),

  planType: PlanType.ENTERPRISE,
});

export type Config = typeof CONFIG;
