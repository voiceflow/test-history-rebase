import { AlexaConstants } from '@voiceflow/alexa-types';
import { Select } from '@voiceflow/ui';
import React from 'react';

import TagSelect from '@/components/TagSelect';
import { getLocaleLabel, LocaleArray } from '@/services/LocaleMap';
import { Identifier } from '@/styles/constants';
import { isAlexaPlatform } from '@/utils/typeGuards';

import { DEFAULT_LANGUAGE_SELECT_PROPS, PLATFORM_PROJECT_META_MAP } from '../constants';
import { AnyLanguage, AnyLocale, LanguageSelectProps as SelectProps, SupportedPlatformProjectType, SupportedPlatformType } from '../types';

interface LanguageSelectProps {
  nlu: SupportedPlatformType | null;
  channel: SupportedPlatformProjectType | null;
  language: AnyLanguage | null;
  setLanguage: (value: AnyLanguage | null) => void;
  alexaLocales: AnyLocale[];
  setAlexaLocales: (locales: AnyLocale[]) => void;
}

const getLanguageSelectProps = (channel: SupportedPlatformProjectType | null, nlu: SupportedPlatformType | null) => {
  let languageSelectProps: SelectProps = DEFAULT_LANGUAGE_SELECT_PROPS;

  if (channel && PLATFORM_PROJECT_META_MAP[channel]?.languageSelectProps) {
    languageSelectProps = PLATFORM_PROJECT_META_MAP[channel]!.languageSelectProps!;
  }

  if (nlu && PLATFORM_PROJECT_META_MAP[nlu]?.languageSelectProps) {
    languageSelectProps = PLATFORM_PROJECT_META_MAP[nlu]!.languageSelectProps!;
  }
  return languageSelectProps;
};

const LanguageSelect: React.FC<LanguageSelectProps> = ({ language, setLanguage, alexaLocales, setAlexaLocales, channel, nlu }) =>
  isAlexaPlatform(channel) ? (
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
      {...getLanguageSelectProps(channel, nlu)}
      id={Identifier.PROJECT_CREATE_SELECT_LANGUAGE}
      value={language}
      useLayers
      onSelect={(value) => setLanguage(value as AnyLanguage)}
      searchable
    />
  );

export default LanguageSelect;
