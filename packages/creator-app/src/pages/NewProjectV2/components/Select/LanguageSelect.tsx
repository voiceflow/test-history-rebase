import { AlexaConstants } from '@voiceflow/alexa-types';
import { Nullable, Utils } from '@voiceflow/common';
import { Select } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import DropdownMultiselect from '@/components/DropdownMultiselect';
import LOCALE_MAP from '@/services/LocaleMap';
import { isAlexaPlatform } from '@/utils/typeGuards';

import {
  AnyLanguage,
  AnyLocale,
  defaultLanguageSelectProps,
  getPlatformOrProjectTypeMeta,
  LanguageSelectProps as SelectProps,
} from '../../constants';

const UnTypedDropdownMultiselect: any = DropdownMultiselect;

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

  const alexaDisplayName = React.useMemo(
    () => (isAlexa ? alexaLocales.map((localValue) => LOCALE_MAP.find((locale) => locale.value === localValue)!.label).join(', ') : ''),
    [isAlexa]
  );

  const handleAlexaLocaleSelect = (val: AlexaConstants.Locale) => {
    setAlexaLocales(alexaLocales.includes(val) ? Utils.array.without(alexaLocales, alexaLocales.indexOf(val)) : [...alexaLocales, val]);
  };

  if (isAlexa) {
    return (
      <UnTypedDropdownMultiselect
        options={LOCALE_MAP}
        withCaret
        onSelect={handleAlexaLocaleSelect}
        placeholder={`Select ${getPlatformOrProjectTypeMeta[VoiceflowConstants.PlatformType.ALEXA]?.localesText}`}
        buttonLabel="Unselect All"
        buttonClick={() => setAlexaLocales([])}
        selectedItems={alexaLocales}
        selectedValue={alexaDisplayName}
        dropdownActive
        searchable
        maxVisibleItems={7.5}
        fullWidth
      />
    );
  }
  return (
    <Select value={language} onSelect={(value: Nullable<string>) => setLanguage(value as AnyLanguage)} {...getLanguageSelectProps(channel, nlu)} />
  );
};

export default LanguageSelect;
