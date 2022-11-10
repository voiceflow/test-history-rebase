import * as Platform from '@voiceflow/platform-config';

import * as NLP from '@/config/nlp';
import { Permission } from '@/config/permissions';

import * as Base from './base';

export const CONFIG = Base.extend({
  is: Platform.Utils.TypeGuards.isValueFactory(Platform.Constants.NLUType.DIALOGFLOW_CX),

  type: Platform.Constants.NLUType.DIALOGFLOW_CX,

  name: 'Dialogflow CX',

  icon: NLP.DialogflowCX.CONFIG.icon,

  nlps: [NLP.DialogflowCX.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.DialogflowCX.CONFIG),

  permission: Permission.NLU_CUSTOM,
});

export type Config = typeof CONFIG;
