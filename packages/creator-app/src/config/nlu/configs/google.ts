import { PlanType } from '@voiceflow/internal';
import * as Platform from '@voiceflow/platform-config';

import * as NLP from '@/config/nlp';

import { NLUType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLUType.GOOGLE,

  name: 'Google',

  icon: Platform.Google.CONFIG.types.voice.icon,

  nlps: [NLP.DialogflowES.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.DialogflowES.CONFIG),

  planType: PlanType.ENTERPRISE,
});

export type Config = typeof CONFIG;
