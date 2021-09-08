import { Utils as AlexaUtils } from '@voiceflow/alexa-types';
import { Constants as GeneralConstants } from '@voiceflow/general-types';
import { Utils as GoogleUtils } from '@voiceflow/google-types';
import { PlatformType } from '@voiceflow/internal';
import { FlexCenter, Input, Select, SvgIcon } from '@voiceflow/ui';
import _constant from 'lodash/constant';
import React from 'react';

import DropdownMultiselect from '@/components/DropdownMultiselect';
import { GENERAL_LOCALE_NAME_MAP, GENERAL_LOCALES_OPTIONS } from '@/constants/platforms';
import { getPlatformMeta } from '@/pages/NewProject/Steps/constants';
import ContinueButton from '@/pages/Onboarding/components/ContinueButton';
import FieldsContainer from '@/pages/Onboarding/Steps/components/FieldsContainer';
import { Container } from '@/pages/Onboarding/Steps/CreateWorkspace/components';
import { LoadingButton } from '@/pages/Payment/Checkout/components/SelectPlan/CheckoutButton/components';
import { FORMATTED_GOOGLE_LOCALES_LABELS, FORMATTED_LOCALES } from '@/pages/Publish/utils';
import LOCALE_MAP from '@/services/LocaleMap';
import { Identifier } from '@/styles/constants';
import { without } from '@/utils/array';
import { getPlatformValue } from '@/utils/platform';
import { isAlexaPlatform, isAnyGeneralPlatform } from '@/utils/typeGuards';

import { SectionDescription, SectionErrorMessage, SectionTitle } from '../components';

const UnTypedDropdownMultiselect: any = DropdownMultiselect;

interface PlatformSettingsProps {
  alexaLocales: string[];
  generalLocale: GeneralConstants.Locale;
  invocationName: string;
  googleLanguage: string;
  creatingProject: boolean;
  setAlexaLocales: (locales: string[]) => void;
  setGeneralLocale: (locale: string) => void;
  finalizeCreation: () => void;
  selectedChannel: PlatformType;
  setInvocationName: (name: string) => void;
  setGoogleLanguage: (val: string) => void;
}

const ProjectSettings: React.FC<PlatformSettingsProps> = ({
  alexaLocales,
  generalLocale,
  invocationName,
  googleLanguage,
  creatingProject,
  setAlexaLocales,
  finalizeCreation,
  setGeneralLocale,
  selectedChannel,
  setInvocationName,
  setGoogleLanguage,
}) => {
  const isAlexa = isAlexaPlatform(selectedChannel);
  const isGeneral = isAnyGeneralPlatform(selectedChannel);

  const alexaDisplayName = isAlexa
    ? alexaLocales.map((localValue) => LOCALE_MAP.find((locale) => locale.value === localValue)!.label).join(', ')
    : '';

  const invocationError =
    invocationName &&
    getPlatformValue<(name?: string, locales?: any[]) => string | null>(
      selectedChannel,
      {
        [PlatformType.ALEXA]: AlexaUtils.getInvocationNameError,
        [PlatformType.GOOGLE]: GoogleUtils.getInvocationNameError,
      },
      _constant(null)
    )(invocationName, alexaLocales);

  const canContinue = !invocationError && (!!alexaLocales.length || !!googleLanguage || !!generalLocale);
  const InvocationDescriptionComponent = getPlatformMeta(selectedChannel).invocationDescription!;
  const LanguageDescriptionComponent = getPlatformMeta(selectedChannel).localesDescription!;

  const GeneralLocalesSelect = () => (
    <Select
      value={generalLocale}
      options={GENERAL_LOCALES_OPTIONS}
      onSelect={setGeneralLocale}
      placeholder="Locale"
      getOptionValue={(option) => option?.value || GeneralConstants.Locale.EN_US}
      getOptionLabel={(value) => GENERAL_LOCALE_NAME_MAP[value as GeneralConstants.Locale] ?? ''}
      renderOptionLabel={(option) => option.name}
    />
  );

  return (
    <Container width={420} textAlign="left">
      {!isGeneral && (
        <FieldsContainer>
          <SectionTitle>Invocation Name</SectionTitle>

          <Input
            id={Identifier.INVOCATION_NAME_INPUT}
            error={!!invocationError}
            placeholder="Enter invocation name"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            value={invocationName}
            onChange={(e) => setInvocationName(e.target.value)}
          />

          {invocationError && invocationName ? (
            <SectionErrorMessage>{invocationError}</SectionErrorMessage>
          ) : (
            <SectionDescription>
              <InvocationDescriptionComponent />
            </SectionDescription>
          )}
        </FieldsContainer>
      )}

      <FieldsContainer>
        <SectionTitle>{getPlatformMeta(selectedChannel).localesText}</SectionTitle>

        {getPlatformValue<() => React.ReactNode>(
          selectedChannel,
          {
            [PlatformType.ALEXA]: () => (
              <UnTypedDropdownMultiselect
                options={LOCALE_MAP}
                autoWidth
                withCaret
                onSelect={(val: string) =>
                  setAlexaLocales(alexaLocales.includes(val) ? without(alexaLocales, alexaLocales.indexOf(val)) : [...alexaLocales, val])
                }
                placeholder={`Select ${getPlatformMeta(PlatformType.ALEXA).localesText}`}
                buttonLabel="Unselect All"
                buttonClick={() => setAlexaLocales([])}
                selectedItems={alexaLocales}
                selectedValue={alexaDisplayName}
                dropdownActive
              />
            ),
            [PlatformType.GOOGLE]: () => (
              <Select
                value={FORMATTED_GOOGLE_LOCALES_LABELS[googleLanguage]}
                options={FORMATTED_LOCALES}
                onSelect={setGoogleLanguage}
                placeholder="Language"
                getOptionValue={(option) => option?.value || ''}
                renderOptionLabel={(option) => option.name}
              />
            ),
          },
          GeneralLocalesSelect
        )()}

        <SectionDescription>
          <LanguageDescriptionComponent />
        </SectionDescription>
      </FieldsContainer>

      <FlexCenter>
        {creatingProject ? (
          <LoadingButton square>
            <SvgIcon icon="publishSpin" size={24} spin />
          </LoadingButton>
        ) : (
          <ContinueButton disabled={!canContinue} onClick={finalizeCreation}>
            Create Project
          </ContinueButton>
        )}
      </FlexCenter>
    </Container>
  );
};

export default ProjectSettings;
