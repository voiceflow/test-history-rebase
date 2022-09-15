import { AlexaUtils } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import { GoogleUtils } from '@voiceflow/google-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { FlexCenter, Input, Select, SvgIcon } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import _constant from 'lodash/constant';
import React from 'react';

import DropdownMultiselect from '@/components/DropdownMultiselect';
import { GENERAL_LOCALE_NAME_MAP, GENERAL_LOCALES_OPTIONS } from '@/constants/platforms';
import { getPlatformMeta } from '@/pages/NewProject/Steps/constants';
import ContinueButton from '@/pages/Onboarding/components/ContinueButton';
import FieldsContainer from '@/pages/Onboarding/Steps/components/FieldsContainer';
import { Container } from '@/pages/Onboarding/Steps/CreateWorkspace/components';
import { LoadingButton } from '@/pages/Payment/Checkout/components/SelectPlan/CheckoutButton/components';
import { FORMATTED_DIALOGFLOW_LOCALES, FORMATTED_DIALOGFLOW_LOCALES_LABELS } from '@/pages/Publish/Dialogflow/utils';
import { FORMATTED_GOOGLE_LOCALES_LABELS, FORMATTED_LOCALES } from '@/pages/Publish/Google/utils';
import LOCALE_MAP from '@/services/LocaleMap';
import { Identifier } from '@/styles/constants';
import { isAlexaPlatform, isDialogflowPlatform, isVoiceflowBasedPlatform } from '@/utils/typeGuards';

import { SectionDescription, SectionErrorMessage, SectionTitle } from '../components';

const UnTypedDropdownMultiselect: any = DropdownMultiselect;

interface PlatformSettingsProps {
  alexaLocales: string[];
  generalLocale: VoiceflowConstants.Locale;
  invocationName: string;
  googleLanguage: string;
  creatingProject: boolean;
  setAlexaLocales: (locales: string[]) => void;
  setGeneralLocale: (locale: string) => void;
  finalizeCreation: () => void;
  platform: VoiceflowConstants.PlatformType;
  setInvocationName: (name: string) => void;
  setGoogleLanguage: (val: string) => void;
  dialogflowLanguage: string;
  setDialogflowLanguage: (val: string) => void;
}

const ProjectSettings: React.FC<PlatformSettingsProps> = ({
  platform,
  alexaLocales,
  generalLocale,
  invocationName,
  googleLanguage,
  creatingProject,
  setAlexaLocales,
  finalizeCreation,
  setGeneralLocale,
  setInvocationName,
  setGoogleLanguage,
  dialogflowLanguage,
  setDialogflowLanguage,
}) => {
  const isAlexa = isAlexaPlatform(platform);
  const isGeneral = isVoiceflowBasedPlatform(platform);
  const isDialogflow = isDialogflowPlatform(platform);

  const alexaDisplayName = isAlexa
    ? alexaLocales.map((localValue) => LOCALE_MAP.find((locale) => locale.value === localValue)!.label).join(', ')
    : '';

  const invocationError =
    invocationName &&
    Realtime.Utils.platform.createPlatformSelector<(name?: string, locales?: any[]) => string | null>(
      {
        [VoiceflowConstants.PlatformType.ALEXA]: AlexaUtils.getInvocationNameError,
        [VoiceflowConstants.PlatformType.GOOGLE]: GoogleUtils.getInvocationNameError,
      },
      _constant(null)
    )(platform)(invocationName, alexaLocales);

  const canContinue = !invocationError && (!!alexaLocales.length || !!googleLanguage || !!generalLocale);
  const InvocationDescriptionComponent = getPlatformMeta(platform).invocationDescription!;
  const LanguageDescriptionComponent = getPlatformMeta(platform).localesDescription!;

  return (
    <Container width={420} textAlign="left">
      {!isGeneral && !isDialogflow && (
        <FieldsContainer>
          <SectionTitle>Invocation Name</SectionTitle>

          <Input
            id={Identifier.INVOCATION_NAME_INPUT}
            error={!!invocationError}
            placeholder="Enter invocation name"
            autoFocus
            value={invocationName}
            onChangeText={setInvocationName}
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
        <SectionTitle>{getPlatformMeta(platform).localesText}</SectionTitle>

        {Realtime.Utils.platform.createPlatformSelector<() => React.ReactNode>(
          {
            [VoiceflowConstants.PlatformType.ALEXA]: () => (
              <UnTypedDropdownMultiselect
                options={LOCALE_MAP}
                autoWidth
                withCaret
                onSelect={(val: string) =>
                  setAlexaLocales(alexaLocales.includes(val) ? Utils.array.without(alexaLocales, alexaLocales.indexOf(val)) : [...alexaLocales, val])
                }
                placeholder={`Select ${getPlatformMeta(VoiceflowConstants.PlatformType.ALEXA).localesText}`}
                buttonLabel="Unselect All"
                buttonClick={() => setAlexaLocales([])}
                selectedItems={alexaLocales}
                selectedValue={alexaDisplayName}
                dropdownActive
              />
            ),
            [VoiceflowConstants.PlatformType.GOOGLE]: () => (
              <Select
                value={googleLanguage}
                options={FORMATTED_LOCALES}
                onSelect={setGoogleLanguage}
                placeholder="Language"
                getOptionKey={(option) => option.value}
                getOptionValue={(option) => option?.value}
                getOptionLabel={(value) => value && FORMATTED_GOOGLE_LOCALES_LABELS[value]}
                renderOptionLabel={(option) => option.name}
              />
            ),
            [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: () => (
              <Select
                value={dialogflowLanguage}
                options={FORMATTED_DIALOGFLOW_LOCALES}
                onSelect={setDialogflowLanguage}
                placeholder="Language"
                getOptionKey={(option) => option.value}
                getOptionValue={(option) => option?.value || ''}
                getOptionLabel={(value) => value && FORMATTED_DIALOGFLOW_LOCALES_LABELS[value]}
                renderOptionLabel={(option) => option.name}
              />
            ),
          },
          () => (
            <Select
              value={generalLocale}
              options={GENERAL_LOCALES_OPTIONS}
              onSelect={setGeneralLocale}
              placeholder="Locale"
              getOptionKey={(option) => option.value}
              getOptionValue={(option) => option?.value || VoiceflowConstants.Locale.EN_US}
              getOptionLabel={(value) => GENERAL_LOCALE_NAME_MAP[value as VoiceflowConstants.Locale] ?? ''}
              renderOptionLabel={(option) => option.name}
            />
          )
        )(platform)()}

        <SectionDescription>
          <LanguageDescriptionComponent />
        </SectionDescription>
      </FieldsContainer>

      <FlexCenter>
        {creatingProject ? (
          <LoadingButton square>
            <SvgIcon icon="arrowSpin" size={24} spin />
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
