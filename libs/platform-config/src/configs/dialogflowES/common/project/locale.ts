import { DFESConstants } from '@voiceflow/google-dfes-types';

import * as Base from '@/configs/base';

const LABEL_MAP: Record<DFESConstants.Language, string> = {
  [DFESConstants.Language.BN]: 'Bengali',
  [DFESConstants.Language.DA]: 'Danish',
  [DFESConstants.Language.DE]: 'German',
  [DFESConstants.Language.ES]: 'Spanish',
  [DFESConstants.Language.FI]: 'Finnish',
  [DFESConstants.Language.FIL]: 'Filipino',
  [DFESConstants.Language.FR]: 'French',
  [DFESConstants.Language.HI]: 'Hindi',
  [DFESConstants.Language.ID]: 'Indonesian',
  [DFESConstants.Language.IT]: 'Italian',
  [DFESConstants.Language.JA]: 'Japanese',
  [DFESConstants.Language.KO]: 'Korean (South Korea)',
  [DFESConstants.Language.MR]: 'Marathi',
  [DFESConstants.Language.MS]: 'Malay',
  [DFESConstants.Language.NL]: 'Dutch',
  [DFESConstants.Language.NO]: 'Norwegian',
  [DFESConstants.Language.PL]: 'Polish',
  [DFESConstants.Language.PT]: 'Portuguese (European)',
  [DFESConstants.Language.BR]: 'Portuguese (Brazilian)',
  [DFESConstants.Language.RO]: 'Romanian',
  [DFESConstants.Language.RU]: 'Russian',
  [DFESConstants.Language.SI]: 'Sinhala',
  [DFESConstants.Language.SV]: 'Swedish',
  [DFESConstants.Language.TA]: 'Tamil',
  [DFESConstants.Language.TE]: 'Telugu',
  [DFESConstants.Language.TH]: 'Thai',
  [DFESConstants.Language.TR]: 'Turkish',
  [DFESConstants.Language.UK]: 'Ukrainian',
  [DFESConstants.Language.VI]: 'Vietnamese',
  [DFESConstants.Language.CN]: 'Chinese (Simplified)',
  [DFESConstants.Language.HK]: 'Chinese (Hong Kong)',
  [DFESConstants.Language.TW]: 'Chinese (Traditional)',
  [DFESConstants.Language.EN]: 'English (EN)',
};

export const CONFIG = Base.Project.Locale.extend({
  enum: DFESConstants.Language,

  list: Object.values(DFESConstants.Language),

  multi: false,

  editable: true,

  storedIn: 'publishing',

  labelMap: LABEL_MAP,

  isLanguage: true,

  description: 'Choose the language you would like your Dialogflow project to support.',

  defaultLocales: [DFESConstants.Language.EN],

  preferredLocales: [DFESConstants.Language.EN],

  utteranceRecommendations: [
    DFESConstants.Locale.EN_AU,
    DFESConstants.Locale.EN_CA,
    DFESConstants.Locale.EN_GB,
    DFESConstants.Locale.EN_IN,
    DFESConstants.Locale.EN_US,
  ],
})(Base.Project.Locale.validate);

export type Config = typeof CONFIG;
