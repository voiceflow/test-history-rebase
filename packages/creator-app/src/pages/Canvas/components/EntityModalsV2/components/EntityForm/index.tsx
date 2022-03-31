import * as Realtime from '@voiceflow/realtime-sdk';
import { Input } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { formatIntentAndSlotName } from '@/utils/intent';

import TypeAndColorSection from '../TypeAndColorSection';
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
  color: string;
  saveColor: (color: string) => void;
}

const EntityForm: React.FC<EntityFormProps> = ({
  color,
  saveColor,
  values,
  saveValues,
  type,
  updateType,
  name,
  updateName,
  saveName,
  withNameSection = true,
}) => {
  const handleInputsChange = (inputs: Realtime.SlotInput[]) => {
    saveValues?.(inputs);
  };

  return (
    <>
      {withNameSection && (
        <Section
          backgroundColor="#fdfdfd"
          header="Name"
          variant={SectionVariant.QUATERNARY}
          customContentStyling={{ paddingBottom: '0px' }}
          customHeaderStyling={{ paddingTop: '20px' }}
        >
          <Input
            onBlur={() => saveName?.()}
            placeholder="Enter entity name"
            value={name}
            onChangeText={(text) => updateName(formatIntentAndSlotName(text))}
          />
        </Section>
      )}
      <TypeAndColorSection color={color} saveColor={saveColor} type={type} onChangeType={updateType} name={name} />
      <ValuesSection inputs={values} type={type} updateInputs={handleInputsChange} />
    </>
  );
};

export default EntityForm;
