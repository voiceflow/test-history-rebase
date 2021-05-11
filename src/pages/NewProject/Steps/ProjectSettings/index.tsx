import { getInvocationNameError as getAlexaInvocationNameError } from '@voiceflow/alexa-types';
import { Locale as GeneralLocale } from '@voiceflow/general-types';
import { getInvocationNameError as getGoogleInvocationNameError } from '@voiceflow/google-types';
import _constant from 'lodash/constant';
import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import DropdownMultiselect from '@/components/DropdownMultiselect';
import { FlexCenter } from '@/components/Flex';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Icon from '@/components/SvgIcon';
import { GENERAL_PLATFORMS, PlatformType } from '@/constants';
import { GENERAL_LOCALE_NAME_MAP, GENERAL_LOCALES_OPTIONS } from '@/constants/platforms';
import { getPlatformMeta } from '@/pages/NewProject/Steps/constants';
import FieldsContainer from '@/pages/Onboarding/Steps/components/FieldsContainer';
import { Container } from '@/pages/Onboarding/Steps/CreateWorkspace/components';
import { LoadingButton } from '@/pages/Payment/Checkout/components/SelectPlan/CheckoutButton/components';
import { FORMATTED_GOOGLE_LOCALES_LABELS, FORMATTED_LOCALES } from '@/pages/Publish/utils';
import LOCALE_MAP from '@/services/LocaleMap';
import { without } from '@/utils/array';
import { getPlatformValue } from '@/utils/platform';

import { SectionDescription, SectionErrorMessage, SectionTitle } from '../components';

const UnTypedDropdownMultiselect: any = DropdownMultiselect;

type PlatformSettingsProps = {
  alexaLocales: string[];
  generalLocale: GeneralLocale;
  invocationName: string;
  googleLanguage: string;
  creatingProject: boolean;
  setAlexaLocales: (locales: string[]) => void;
  setGeneralLocale: (locale: string) => void;
  finalizeCreation: () => void;
  selectedChannel: PlatformType;
  setInvocationName: (name: string) => void;
  setGoogleLanguage: (val: string) => void;
};

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
  const isAlexa = selectedChannel === PlatformType.ALEXA;
  const isGeneral = GENERAL_PLATFORMS.includes(selectedChannel);

  const alexaDisplayName = isAlexa
    ? alexaLocales.map((localValue) => LOCALE_MAP.find((locale) => locale.value === localValue)!.label).join(', ')
    : '';

  const invocationError =
    invocationName &&
    getPlatformValue<(name?: string, locales?: any[]) => string | null>(
      selectedChannel,
      {
        [PlatformType.ALEXA]: getAlexaInvocationNameError,
        [PlatformType.GOOGLE]: getGoogleInvocationNameError,
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
      getOptionValue={(option) => option?.value || GeneralLocale.EN_US}
      getOptionLabel={(value) => GENERAL_LOCALE_NAME_MAP[value as GeneralLocale] ?? ''}
      renderOptionLabel={(option) => option.name}
    />
  );

  return (
    <Container width={420} textAlign="left">
      {!isGeneral && (
        <FieldsContainer>
          <SectionTitle>Invocation Name</SectionTitle>

          <Input
            error={!!invocationError}
            placeholder="Enter invocation name"
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
          <LoadingButton variant="primary" square>
            <Icon icon="publishSpin" size={24} spin />
          </LoadingButton>
        ) : (
          <Button variant={ButtonVariant.PRIMARY} disabled={!canContinue} onClick={finalizeCreation}>
            Create Project
          </Button>
        )}
      </FlexCenter>
    </Container>
  );
};

export default ProjectSettings;
