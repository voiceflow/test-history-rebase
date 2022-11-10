import * as Platform from '@voiceflow/platform-config';

import * as NLP from '@/config/nlp';
import { Permission } from '@/config/permissions';

import * as Base from './base';

export const CONFIG = Base.extend({
  is: Platform.Utils.TypeGuards.isValueFactory(Platform.Constants.NLUType.WATSON),

  type: Platform.Constants.NLUType.WATSON,

  name: 'IBM Watson',

  icon: NLP.Watson.CONFIG.icon,

  nlps: [NLP.Watson.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.Watson.CONFIG),

  permission: Permission.NLU_CUSTOM,
});

export type Config = typeof CONFIG;
