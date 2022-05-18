import * as Realtime from '@voiceflow/realtime-sdk';
import { ClickableText, Input, StrictPopperModifiers } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { CUSTOM_SLOT_TYPE } from '@/constants';
import { DividerBorder } from '@/pages/Canvas/components/IntentModalsV2/components/components';
import { applyAlexaIntentAndSlotNameFormatting } from '@/utils/intent';

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
  colorPopperModifiers?: StrictPopperModifiers;
}

const EntityForm: React.ForwardRefRenderFunction<HTMLInputElement, EntityFormProps> = (
  {
    color,
    saveColor,
    colorPopperModifiers,
    values,
    saveValues,
    withBottomDivider,
    type,
    updateType,
    name,
    updateName,
    saveName,
    withNameSection = true,
  },
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
            onChangeText={(text) => updateName(applyAlexaIntentAndSlotNameFormatting(text))}
          />
        </Section>
      )}
      <TypeAndColorSection
        colorPopperModifiers={colorPopperModifiers}
        color={color}
        saveColor={saveColor}
        type={type}
        onChangeType={updateType}
        name={name}
      />
      {!isCustomSlot && !hasExtendedEntity && (
        <>
          <MessageWrapper>
            <BuiltInIntentMessage>
              Entities with built-in types don't require additional sample values. If you'd like to add more you can{' '}
              <ClickableText onClick={() => setHasExtendedEntity(true)}>extend the entity.</ClickableText>
            </BuiltInIntentMessage>
          </MessageWrapper>
          <DividerBorder />
        </>
      )}
      {(isCustomSlot || hasExtendedEntity || hasValues) && (
        <ValuesSection withBottomDivider={withBottomDivider} inputs={values} type={type} updateInputs={handleInputsChange} />
      )}
    </>
  );
};

export default React.forwardRef(EntityForm);
