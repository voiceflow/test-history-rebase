import * as Platform from '@voiceflow/platform-config';

import * as NLP from '@/config/nlp';
import { Permission } from '@/config/permissions';

import * as Base from './base';

export const CONFIG = Base.extend({
  is: Platform.Utils.TypeGuards.isValueFactory(Platform.Constants.NLUType.RASA),

  type: Platform.Constants.NLUType.RASA,

  name: 'Rasa',

  icon: NLP.Rasa2.CONFIG.icon,

  nlps: [NLP.Rasa2.CONFIG, NLP.Rasa3.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.Rasa2.CONFIG),

  permission: Permission.NLU_CUSTOM,
});

export type Config = typeof CONFIG;
