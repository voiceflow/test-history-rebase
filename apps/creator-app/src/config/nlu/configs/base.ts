import * as Platform from '@voiceflow/platform-config';

import * as NLP from '@/config/nlp';
import { Permission } from '@/constants/permissions';

interface Tooltip {
  title: string;

  description: string;
}

export interface Config {
  is: (nlu?: unknown) => boolean;

  type: Platform.Constants.NLUType;

  name: string;

  icon: Platform.Types.Icon;

  /**
   * base nlp is used for importing
   */
  nlps: [base: NLP.Base.Config, ...rest: NLP.Base.Config[]];

  tooltip: Tooltip;

  permission: Permission.NLU_CUSTOM | null;

  helpURL: string | null;
}

export const tooltip = (nlpConfig: NLP.Base.Config): Tooltip => ({
  title: nlpConfig.name,
  description: `Import and export/upload NLU models for ${nlpConfig.name}.`,
});

export const CONFIG = Platform.Utils.Types.satisfies<Config>()({
  is: Platform.Utils.TypeGuards.isValueFactory(Platform.Constants.NLUType.VOICEFLOW),

  type: Platform.Constants.NLUType.VOICEFLOW,

  name: 'Default',

  icon: {
    name: 'voiceflowV',
    color: '#132144',
  },

  nlps: [NLP.Voiceflow.CONFIG],

  tooltip: tooltip(NLP.Base.CONFIG),

  permission: null,

  helpURL: null,
});

export const extend = Platform.ConfigUtils.Config.extendFactory<Config>(CONFIG);
export const validate = Platform.ConfigUtils.Config.validateFactory<Config>(CONFIG);
