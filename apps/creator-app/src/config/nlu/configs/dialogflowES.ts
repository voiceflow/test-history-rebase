import * as Platform from '@voiceflow/platform-config';

import * as NLP from '@/config/nlp';

import * as Base from './base';

export const CONFIG = Base.extend({
  is: Platform.Utils.TypeGuards.isValueFactory(Platform.Constants.NLUType.DIALOGFLOW_ES),

  type: Platform.Constants.NLUType.DIALOGFLOW_ES,

  name: 'Dialogflow ES',

  icon: NLP.DialogflowES.CONFIG.icon,

  nlps: [NLP.DialogflowES.CONFIG, NLP.Voiceflow.CONFIG],

  tooltip: Base.tooltip(NLP.DialogflowES.CONFIG),

  helpURL: 'https://voiceflow.zendesk.com/hc/en-us/articles/9499645120781-Dialogflow-ES-Imports-Exports',
})(Base.validate);

export type Config = typeof CONFIG;
