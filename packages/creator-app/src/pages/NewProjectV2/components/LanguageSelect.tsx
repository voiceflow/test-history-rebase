import { AlexaConstants } from '@voiceflow/alexa-types';
import * as Platform from '@voiceflow/platform-config';
import { Select } from '@voiceflow/ui';
import React from 'react';

import TagSelect from '@/components/TagSelect';
import { getLocaleLabel, LocaleArray } from '@/services/LocaleMap';
import { Identifier } from '@/styles/constants';
import { isAlexaPlatform } from '@/utils/typeGuards';

import { DEFAULT_LANGUAGE_SELECT_PROPS, PLATFORM_PROJECT_META_MAP } from '../constants';
import { AnyLanguage, AnyLocale } from '../types';

interface LanguageSelectProps {
  nlu: Platform.Constants.NLUType | null;
  platform: Platform.Constants.PlatformType | null;
  language: AnyLanguage | null;
  setLanguage: (value: AnyLanguage | null) => void;
  alexaLocales: AnyLocale[];
  setAlexaLocales: (locales: AnyLocale[]) => void;
}

const getLanguageSelectProps = (nlu: Platform.Constants.NLUType | null, platform: Platform.Constants.PlatformType | null) => {
  if (nlu && PLATFORM_PROJECT_META_MAP[nlu]?.languageSelectProps) {
    return PLATFORM_PROJECT_META_MAP[nlu].languageSelectProps!;
  }

  if (platform && PLATFORM_PROJECT_META_MAP[platform]?.languageSelectProps) {
    return PLATFORM_PROJECT_META_MAP[platform].languageSelectProps!;
  }

  return DEFAULT_LANGUAGE_SELECT_PROPS;
};

const LanguageSelect: React.FC<LanguageSelectProps> = ({ nlu, platform, language, setLanguage, alexaLocales, setAlexaLocales }) =>
  isAlexaPlatform(platform) ? (
    <TagSelect
      id={Identifier.PROJECT_CREATE_SELECT_LOCALE}
      value={alexaLocales}
      options={LocaleArray}
      useLayers
      onChange={setAlexaLocales as (value: string[]) => void}
      maxHeight={200}
      placeholder="Select locales"
      getOptionLabel={(value) => getLocaleLabel[value as AlexaConstants.Locale]}
      getOptionValue={(option) => option}
      createInputPlaceholder="locales"
    />
  ) : (
    <Select
      {...getLanguageSelectProps(nlu, platform)}
      id={Identifier.PROJECT_CREATE_SELECT_LANGUAGE}
      value={language}
      useLayers
      onSelect={(value) => setLanguage(value as AnyLanguage)}
      searchable
    />
  );

export default LanguageSelect;
