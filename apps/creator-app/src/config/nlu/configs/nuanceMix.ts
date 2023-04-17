import * as Platform from '@voiceflow/platform-config';

import * as NLP from '@/config/nlp';
import { Permission } from '@/constants/permissions';

import * as Base from './base';

export const CONFIG = Base.extend({
  is: Platform.Utils.TypeGuards.isValueFactory(Platform.Constants.NLUType.NUANCE_MIX),

  type: Platform.Constants.NLUType.NUANCE_MIX,

  name: 'Nuance Mix',

  icon: NLP.NuanceMix.CONFIG.icon,

  nlps: [NLP.NuanceMix.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.NuanceMix.CONFIG),

  permission: Permission.NLU_CUSTOM,

  helpURL: 'https://voiceflow.zendesk.com/hc/en-us/articles/10827898199181',
})(Base.validate);

export type Config = typeof CONFIG;
