import { GoogleConstants } from '@voiceflow/google-types';

import * as Base from '@/configs/base';

const LABEL_MAP: Record<GoogleConstants.Language, string> = {
  [GoogleConstants.Language.HK]: 'Chinese-Cantonese (zh-HK)',
  [GoogleConstants.Language.TW]: 'Chinese-Traditional (zh-TW)',
  [GoogleConstants.Language.DA]: 'Danish (da)',
  [GoogleConstants.Language.NL]: 'Dutch (nl)',
  [GoogleConstants.Language.EN]: 'English (en)',
  [GoogleConstants.Language.FR]: 'French (fr)',
  [GoogleConstants.Language.DE]: 'German (de)',
  [GoogleConstants.Language.HI]: 'Hindi (hi)',
  [GoogleConstants.Language.ID]: 'Indonesian (id)',
  [GoogleConstants.Language.IT]: 'Italian (it)',
  [GoogleConstants.Language.JA]: 'Japanese (ja)',
  [GoogleConstants.Language.KO]: 'Korean (ko)',
  [GoogleConstants.Language.NO]: 'Norwegian (no)',
  [GoogleConstants.Language.PL]: 'Polish (pl)',
  [GoogleConstants.Language.PT]: 'Portuguese (Brazilian) (pt)',
  [GoogleConstants.Language.RU]: 'Russian (ru)',
  [GoogleConstants.Language.ES]: 'Spanish (es)',
  [GoogleConstants.Language.SV]: 'Swedish (sv)',
  [GoogleConstants.Language.TH]: 'Thai (th)',
  [GoogleConstants.Language.TR]: 'Turkish (tr)',
};

export const CONFIG = Base.Project.Locale.extend({
  enum: GoogleConstants.Language,

  list: Object.values(GoogleConstants.Language),

  multi: false,

  editable: true,

  storedIn: 'publishing',

  labelMap: LABEL_MAP,

  isLanguage: true,

  description: 'Choose the language you would like your Google Action to support.',

  defaultLocales: [GoogleConstants.Language.EN],

  preferredLocales: [GoogleConstants.Language.EN],

  utteranceRecommendations: [
    GoogleConstants.Locale.EN_AU,
    GoogleConstants.Locale.EN_CA,
    GoogleConstants.Locale.EN_GB,
    GoogleConstants.Locale.EN_IN,
    GoogleConstants.Locale.EN_BE,
    GoogleConstants.Locale.EN_SG,
    GoogleConstants.Locale.EN_US,
  ],
})(Base.Project.Locale.validate);

export type Config = typeof CONFIG;
