import * as Platform from '@voiceflow/platform-config';

import * as NLP from '@/config/nlp';
import { Permission } from '@/config/permissions';

import * as Base from './base';

export const CONFIG = Base.extend({
  is: Platform.Utils.TypeGuards.isValueFactory(Platform.Constants.NLUType.EINSTEIN),

  type: Platform.Constants.NLUType.EINSTEIN,

  name: 'Salesforce Einstein',

  icon: NLP.Einstein.CONFIG.icon,

  nlps: [NLP.Einstein.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.Einstein.CONFIG),

  permission: Permission.NLU_CUSTOM,
});

export type Config = typeof CONFIG;
