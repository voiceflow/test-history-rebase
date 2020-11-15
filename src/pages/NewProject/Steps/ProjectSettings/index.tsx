import _constant from 'lodash/constant';
import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import DropdownMultiselect from '@/components/DropdownMultiselect';
import { FlexCenter } from '@/components/Flex';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Icon from '@/components/SvgIcon';
import { PlatformType } from '@/constants';
import { PLATFORM_META } from '@/pages/NewProject/Steps/constants';
import { Container } from '@/pages/Onboarding/Steps/CreateWorkspace/components';
import FieldsContainer from '@/pages/Onboarding/Steps/components/FieldsContainer';
import { LoadingButton } from '@/pages/Payment/Checkout/components/SelectPlan/CheckoutButton/components';
import { FORMATTED_LOCALES, GOOGLE_LANGUAGE_TO_LOCALES, getAmazonInvocationNameError, getGoogleInvocationNameError } from '@/pages/Publish/utils';
import { FORMATTED_GOOGLE_LOCALES_LABELS } from '@/pages/Settings/components/SettingsContent/Sections/Basic';
import LOCALE_MAP from '@/services/LocaleMap';
import { without } from '@/utils/array';
import { getPlatformValue } from '@/utils/platform';

import { SectionDescription, SectionErrorMessage, SectionTitle } from '../components';

const UnTypedDropdownMultiselect: any = DropdownMultiselect;

type PlatformSettingsProps = {
  selectedPlatform: PlatformType;
  invocationName: string;
  setInvocationName: (name: string) => void;
  selectedLocales: string[];
  setSelectedLocales: (locales: string[]) => void;
  finalizeCreation: () => void;
  creatingProject: boolean;
  mainLanguage: string;
  setMainLanguage: (val: string) => void;
};

const ProjectSettings: React.FC<PlatformSettingsProps> = ({
  selectedPlatform,
  setInvocationName,
  creatingProject,
  invocationName,
  selectedLocales,
  setSelectedLocales,
  finalizeCreation,
  mainLanguage,
  setMainLanguage,
}) => {
  const alexaDisplayName =
    selectedPlatform === PlatformType.ALEXA
      ? selectedLocales.map((localValue) => LOCALE_MAP.find((locale) => locale.value === localValue)!.label).join(', ')
      : '';
  const invocationError =
    invocationName &&
    getPlatformValue<(name?: string, locales?: any[]) => string | null>(
      selectedPlatform,
      {
        [PlatformType.ALEXA]: getAmazonInvocationNameError,
        [PlatformType.GOOGLE]: getGoogleInvocationNameError,
      },
      _constant(null)
    )(invocationName, selectedLocales);
  const canContinue = !invocationError && (!!selectedLocales.length || !!mainLanguage);
  const InvocationDescriptionComponent: React.FC = PLATFORM_META[selectedPlatform].invocationDescription!;
  const LanguageDescriptionComponent: React.FC = PLATFORM_META[selectedPlatform].localesDescription!;

  return (
    <Container width={420} textAlign="left">
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
      <FieldsContainer>
        <SectionTitle>{PLATFORM_META[selectedPlatform].localesText}</SectionTitle>
        {selectedPlatform === PlatformType.GOOGLE ? (
          <Select
            placeholder="Language"
            value={FORMATTED_GOOGLE_LOCALES_LABELS[mainLanguage]}
            options={FORMATTED_LOCALES}
            onSelect={(val: any) => {
              setMainLanguage(val);
              setSelectedLocales(GOOGLE_LANGUAGE_TO_LOCALES[val]);
            }}
            getOptionValue={(option) => option?.value || ''}
            renderOptionLabel={(option) => option.name}
          />
        ) : (
          <UnTypedDropdownMultiselect
            placeholder={`Select ${PLATFORM_META[selectedPlatform].localesText}`}
            buttonLabel="Unselect All"
            buttonClick={() => setSelectedLocales([])}
            options={LOCALE_MAP}
            autoWidth
            onSelect={(val: string) => {
              const newLocales = selectedLocales.includes(val) ? without(selectedLocales, selectedLocales.indexOf(val)) : [...selectedLocales, val];
              setSelectedLocales(newLocales);
            }}
            selectedItems={selectedLocales}
            selectedValue={alexaDisplayName}
            withCaret
          />
        )}
        <SectionDescription>
          <LanguageDescriptionComponent />
        </SectionDescription>
      </FieldsContainer>
      <FlexCenter>
        {creatingProject ? (
          <>
            <LoadingButton variant="primary" square>
              <Icon icon="publishSpin" size={24} spin />
            </LoadingButton>
          </>
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
