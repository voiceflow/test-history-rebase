import { PlanType } from '@voiceflow/internal';
import * as Platform from '@voiceflow/platform';

import * as NLP from '@/config/nlp';

import { NLUType } from '../constants';

interface Tooltip {
  title: string;

  description: string;
}

export interface Config {
  type: NLUType;

  name: string;

  icon: NLP.Base.Icon;

  /**
   * base nlp is used for importing
   */
  nlps: [base: NLP.Base.Config, ...rest: NLP.Base.Config[]];

  tooltip: Tooltip;

  planType: PlanType | null;
}

export const tooltip = (nlpConfig: NLP.Base.Config): Tooltip => ({
  title: nlpConfig.name,
  description: `Import and export/upload NLU models for ${nlpConfig.name}.`,
});

export const CONFIG = Platform.Utils.Types.satisfies<Config>()({
  type: NLUType.VOICEFLOW,

  name: 'Default',

  icon: {
    name: 'voiceflowV',
    color: '#132144',
  },

  nlps: [NLP.Voiceflow.CONFIG, ...NLP.Config.getAll().filter((nlp) => nlp !== NLP.Voiceflow.CONFIG)],

  tooltip: tooltip(NLP.Base.CONFIG),

  planType: null,
});

export const extend = Platform.Base.extendFactory<Config>()(CONFIG);
