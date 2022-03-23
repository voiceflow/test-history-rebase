import * as Realtime from '@voiceflow/realtime-sdk';
import { Input } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';

import TypeSection from '../TypeSection';
import ValuesSection from '../ValuesSection';

interface EntityFormProps {
  values: Realtime.SlotInput[];
  saveValues?: (inputs: Realtime.SlotInput[]) => void;
  type: string | null;
  updateType: (type: string) => void;
  name: string;
  updateName: (name: string) => void;
  saveName?: () => void;
  withNameSection?: boolean;
}

const EntityForm: React.FC<EntityFormProps> = ({ values, saveValues, type, updateType, name, updateName, saveName, withNameSection = true }) => {
  const handleInputsChange = (inputs: Realtime.SlotInput[]) => {
    saveValues?.(inputs);
  };

  return (
    <>
      {withNameSection && (
        <Section backgroundColor="#fdfdfd" header="Name" variant={SectionVariant.QUATERNARY} customContentStyling={{ paddingBottom: '0px' }}>
          <Input onBlur={() => saveName?.()} placeholder="Enter entity name" value={name} onChangeText={updateName} />
        </Section>
      )}
      <TypeSection type={type} onChangeType={updateType} />
      <ValuesSection inputs={values} type={type} updateInputs={handleInputsChange} />
    </>
  );
};

export default EntityForm;
