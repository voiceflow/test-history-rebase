import * as Realtime from '@voiceflow/realtime-sdk';
import { ClickableText, Input } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { CUSTOM_SLOT_TYPE } from '@/constants';
import { formatIntentAndSlotName } from '@/utils/intent';

import TypeAndColorSection from '../TypeAndColorSection';
import ValuesSection from '../ValuesSection';
import { BuiltInIntentMessage, MessageWrapper } from './styles';

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
  withBottomDivider?: boolean;
}

const EntityForm: React.ForwardRefRenderFunction<HTMLInputElement, EntityFormProps> = (
  { color, saveColor, values, saveValues, withBottomDivider, type, updateType, name, updateName, saveName, withNameSection = true },
  ref
) => {
  const [hasExtendedEntity, setHasExtendedEntity] = React.useState<boolean>(false);
  const hasValues = Boolean(values.length);
  const isCustomSlot = type === CUSTOM_SLOT_TYPE;

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
            ref={ref}
            onBlur={() => saveName?.()}
            placeholder="Enter entity name"
            value={name}
            onChangeText={(text) => updateName(formatIntentAndSlotName(text))}
          />
        </Section>
      )}
      <TypeAndColorSection color={color} saveColor={saveColor} type={type} onChangeType={updateType} name={name} />
      {!isCustomSlot && !hasExtendedEntity && (
        <MessageWrapper>
          <BuiltInIntentMessage>
            Entities with built-in types don't require additional sample values. If you'd like to add more you can{' '}
            <ClickableText onClick={() => setHasExtendedEntity(true)}>extend the entity.</ClickableText>
          </BuiltInIntentMessage>
        </MessageWrapper>
      )}
      {(isCustomSlot || hasExtendedEntity || hasValues) && (
        <ValuesSection withBottomDivider={withBottomDivider} inputs={values} type={type} updateInputs={handleInputsChange} />
      )}
    </>
  );
};

export default React.forwardRef(EntityForm);
