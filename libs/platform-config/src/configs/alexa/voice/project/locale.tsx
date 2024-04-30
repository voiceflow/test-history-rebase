import { AlexaConstants } from '@voiceflow/alexa-types';
import { Link } from '@voiceflow/ui';
import React from 'react';

import * as Base from '@/configs/base';

const LABEL_MAP: Record<AlexaConstants.Locale, string> = {
  [AlexaConstants.Locale.EN_US]: 'English (US)',
  [AlexaConstants.Locale.EN_GB]: 'English (UK)',
  [AlexaConstants.Locale.EN_AU]: 'English (AU)',
  [AlexaConstants.Locale.EN_CA]: 'English (CA)',
  [AlexaConstants.Locale.EN_IN]: 'English (IN)',
  [AlexaConstants.Locale.DE_DE]: 'German (DE)',
  [AlexaConstants.Locale.JA_JP]: 'Japanese (JP)',
  [AlexaConstants.Locale.ES_US]: 'Spanish (US)',
  [AlexaConstants.Locale.ES_ES]: 'Spanish (ES)',
  [AlexaConstants.Locale.FR_FR]: 'French (FR)',
  [AlexaConstants.Locale.IT_IT]: 'Italian (IT)',
  [AlexaConstants.Locale.ES_MX]: 'Spanish (MX)',
  [AlexaConstants.Locale.FR_CA]: 'French (CA)',
  [AlexaConstants.Locale.PT_BR]: 'Portuguese (BR)',
  [AlexaConstants.Locale.HI_IN]: 'Hindi (IN)',
};

export const CONFIG = Base.Project.Locale.extend({
  name: 'Locales',

  enum: AlexaConstants.Locale,

  list: Object.values(AlexaConstants.Locale),

  multi: true,

  editable: true,

  storedIn: 'publishing',

  labelMap: LABEL_MAP,

  isLanguage: false,

  description: (
    <>
      A{' '}
      <Link href="https://developer.amazon.com/en-US/docs/alexa/faq/distribute-your-skill-to-additional-locales-of-the-same-language.html">
        locale
      </Link>{' '}
      is the combination of a language and a location. Choose one or more locales you want your Skill to support.
    </>
  ),

  defaultLocales: [AlexaConstants.Locale.EN_US],

  preferredLocales: [AlexaConstants.Locale.EN_US, AlexaConstants.Locale.EN_GB],

  utteranceRecommendations: [
    AlexaConstants.Locale.EN_US,
    AlexaConstants.Locale.EN_AU,
    AlexaConstants.Locale.EN_CA,
    AlexaConstants.Locale.EN_IN,
    AlexaConstants.Locale.EN_GB,
  ],
})(Base.Project.Locale.validate);

export type Config = typeof CONFIG;
