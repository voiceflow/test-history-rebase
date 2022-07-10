import * as Realtime from '@voiceflow/realtime-sdk';
import { ClickableText, Input, StrictPopperModifiers } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { CUSTOM_SLOT_TYPE } from '@/constants';
import { DividerBorder } from '@/pages/Canvas/components/IntentModalsV2/components/components';
import { applySlotNameFormatting } from '@/utils/slot';

import TypeAndColorSection from '../TypeAndColorSection';
import ValuesSection from '../ValuesSection';
import { BuiltInIntentMessage, MessageWrapper } from './styles';

interface EntityFormProps {
  type: string | null;
  name: string;
  color: string;
  values: Realtime.SlotInput[];
  saveName?: () => void;
  saveColor: (color: string) => void;
  updateType: (type: string) => void;
  updateName: (name: string) => void;
  saveValues?: (inputs: Realtime.SlotInput[]) => void;
  withNameSection?: boolean;
  withBottomDivider?: boolean;
  colorPopperModifiers?: StrictPopperModifiers;
}

const EntityForm = React.forwardRef<HTMLInputElement, EntityFormProps>(
  (
    {
      type,
      name,
      color,
      values,
      saveName,
      saveColor,
      updateType,
      saveValues,
      updateName,
      withNameSection = true,
      withBottomDivider,
      colorPopperModifiers,
    },
    ref
  ) => {
    const [hasExtendedEntity, setHasExtendedEntity] = React.useState(!!values.length);
    const isCustomSlot = type === CUSTOM_SLOT_TYPE;

    return (
      <>
        {withNameSection && (
          <Section
            header="Name"
            variant={SectionVariant.QUATERNARY}
            backgroundColor="#fdfdfd"
            customContentStyling={{ paddingBottom: '0px' }}
            customHeaderStyling={{ paddingTop: '20px' }}
          >
            <Input
              ref={ref}
              value={name}
              onBlur={() => saveName?.()}
              placeholder="Enter entity name"
              onChangeText={(text) => updateName(applySlotNameFormatting(text))}
            />
          </Section>
        )}
        <TypeAndColorSection
          name={name}
          type={type}
          color={color}
          saveColor={saveColor}
          onChangeType={updateType}
          colorPopperModifiers={colorPopperModifiers}
        />

        {!isCustomSlot && !hasExtendedEntity && (
          <MessageWrapper>
            <BuiltInIntentMessage>
              Entities with built-in types don't require additional sample values. If you'd like to add more you can{' '}
              <ClickableText onClick={() => setHasExtendedEntity(true)}>extend the entity.</ClickableText>
            </BuiltInIntentMessage>
          </MessageWrapper>
        )}

        {isCustomSlot || hasExtendedEntity || !!values.length ? (
          <ValuesSection withBottomDivider={withBottomDivider} inputs={values} type={type} updateInputs={(inputs) => saveValues?.(inputs)} />
        ) : (
          withBottomDivider && <DividerBorder />
        )}
      </>
    );
  }
);

export default EntityForm;
