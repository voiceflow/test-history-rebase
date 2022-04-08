import { AlexaConstants } from '@voiceflow/alexa-types';
import { Nullable, Nullish } from '@voiceflow/common';
import { Select } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import TagSelect from '@/components/TagSelect';
import { getLocaleLabel, LocaleArray } from '@/services/LocaleMap';
import { isAlexaPlatform } from '@/utils/typeGuards';

import { defaultLanguageSelectProps, getPlatformOrProjectTypeMeta } from '../../constants';
import { AnyLanguage, AnyLocale, LanguageSelectProps as SelectProps } from '../../types';

interface LanguageSelectProps {
  language?: AnyLanguage;
  setLanguage: (value?: AnyLanguage) => void;
  alexaLocales: AnyLocale[];
  setAlexaLocales: (locales: AnyLocale[]) => void;
  channel?: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType;
  nlu?: VoiceflowConstants.PlatformType;
}

const getLanguageSelectProps = (
  channel?: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType,
  nlu?: VoiceflowConstants.PlatformType
) => {
  let languageSelectProps: SelectProps = defaultLanguageSelectProps;

  if (channel && getPlatformOrProjectTypeMeta[channel]?.languageSelectProps) {
    languageSelectProps = getPlatformOrProjectTypeMeta[channel]!.languageSelectProps!;
  }

  if (nlu && getPlatformOrProjectTypeMeta[nlu]?.languageSelectProps) {
    languageSelectProps = getPlatformOrProjectTypeMeta[nlu]!.languageSelectProps!;
  }
  return languageSelectProps;
};

const LanguageSelect: React.FC<LanguageSelectProps> = ({ language, setLanguage, alexaLocales, setAlexaLocales, channel, nlu }) => {
  const isAlexa = isAlexaPlatform(channel);

  if (isAlexa) {
    return (
      <TagSelect
        value={alexaLocales}
        options={LocaleArray}
        onChange={setAlexaLocales as (value: string[]) => void}
        getOptionLabel={(value: Nullish<string>) => getLocaleLabel[value as AlexaConstants.Locale]}
        getOptionValue={(option) => option}
        placeholder="Select locales"
        createInputPlaceholder="locales"
        maxHeight={200}
      />
    );
  }
  return (
    <Select
      value={language}
      onSelect={(value: Nullable<string>) => setLanguage(value as AnyLanguage)}
      {...getLanguageSelectProps(channel, nlu)}
      searchable
    />
  );
};

export default LanguageSelect;
