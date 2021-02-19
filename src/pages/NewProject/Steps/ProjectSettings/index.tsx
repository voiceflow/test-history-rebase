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
import { PlatformType } from '@/constants';
import { GENERAL_LOCALE_NAME_MAP, GENERAL_LOCALES_OPTIONS } from '@/constants/platforms';
import { PLATFORM_META } from '@/pages/NewProject/Steps/constants';
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
  selectedPlatform: PlatformType;
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
  selectedPlatform,
  setInvocationName,
  setGoogleLanguage,
}) => {
  const isAlexa = selectedPlatform === PlatformType.ALEXA;
  const isGeneral = selectedPlatform === PlatformType.GENERAL;

  const alexaDisplayName = isAlexa
    ? alexaLocales.map((localValue) => LOCALE_MAP.find((locale) => locale.value === localValue)!.label).join(', ')
    : '';

  const invocationError =
    invocationName &&
    getPlatformValue<(name?: string, locales?: any[]) => string | null>(
      selectedPlatform,
      {
        [PlatformType.ALEXA]: getAlexaInvocationNameError,
        [PlatformType.GOOGLE]: getGoogleInvocationNameError,
      },
      _constant(null)
    )(invocationName, alexaLocales);

  const canContinue = !invocationError && (!!alexaLocales.length || !!googleLanguage || !!generalLocale);
  const InvocationDescriptionComponent = PLATFORM_META[selectedPlatform].invocationDescription!;
  const LanguageDescriptionComponent = PLATFORM_META[selectedPlatform].localesDescription!;

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
        <SectionTitle>{PLATFORM_META[selectedPlatform].localesText}</SectionTitle>

        {getPlatformValue<() => React.ReactNode>(
          selectedPlatform,
          {
            // eslint-disable-next-line react/display-name
            [PlatformType.ALEXA]: () => (
              <UnTypedDropdownMultiselect
                options={LOCALE_MAP}
                autoWidth
                withCaret
                onSelect={(val: string) =>
                  setAlexaLocales(alexaLocales.includes(val) ? without(alexaLocales, alexaLocales.indexOf(val)) : [...alexaLocales, val])
                }
                placeholder={`Select ${PLATFORM_META[selectedPlatform].localesText}`}
                buttonLabel="Unselect All"
                buttonClick={() => setAlexaLocales([])}
                selectedItems={alexaLocales}
                selectedValue={alexaDisplayName}
                dropdownActive
              />
            ),
            // eslint-disable-next-line react/display-name
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
            // eslint-disable-next-line react/display-name
            [PlatformType.GENERAL]: () => (
              <Select
                value={generalLocale}
                options={GENERAL_LOCALES_OPTIONS}
                onSelect={setGeneralLocale}
                placeholder="Locale"
                getOptionValue={(option) => option?.value || GeneralLocale.EN_US}
                getOptionLabel={(value) => GENERAL_LOCALE_NAME_MAP[value as GeneralLocale] ?? ''}
                renderOptionLabel={(option) => option.name}
              />
            ),
          },
          () => null
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
