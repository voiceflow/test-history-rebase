import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import DropdownMultiselect from '@/components/DropdownMultiselect';
import { FlexCenter } from '@/components/Flex';
import Input from '@/components/Input';
import { invNameError } from '@/ducks/publish/utils';
import { PLATFORM_META, Platform } from '@/pages/NewProject/Steps/constants';
import { Container } from '@/pages/Onboarding/Steps/CreateWorkspace/components';
import FieldsContainer from '@/pages/Onboarding/Steps/components/FieldsContainer';
import LOCALE_MAP from '@/services/LocaleMap';
import { without } from '@/utils/array';

import { SectionDescription, SectionErrorMessage, SectionTitle } from '../components';

const UnTypedDropdownMultiselect: any = DropdownMultiselect;

type PlatformSettingsProps = {
  selectedPlatform: Platform;
  invocationName: string;
  setInvocationName: (name: string) => void;
  selectedLocales: string[];
  setSelectedLocales: (locales: string[]) => void;
};

const ProjectSettings: React.FC<PlatformSettingsProps> = ({
  selectedPlatform,
  setInvocationName,
  invocationName,
  selectedLocales,
  setSelectedLocales,
}) => {
  const displayName = selectedLocales.map((localValue) => LOCALE_MAP.find((locale) => locale.value === localValue)!.label).join(', ');
  const invocationError = invocationName && invNameError(invocationName, selectedLocales);
  const canContinue = !invocationError && !!selectedLocales.length;
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
          selectedValue={displayName}
          withCaret
        />
        <SectionDescription>
          <LanguageDescriptionComponent />
        </SectionDescription>
      </FieldsContainer>
      <FlexCenter>
        <Button variant={ButtonVariant.PRIMARY} disabled={!canContinue}>
          Create Project
        </Button>
      </FlexCenter>
    </Container>
  );
};

export default ProjectSettings;
