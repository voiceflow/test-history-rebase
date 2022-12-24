import * as Realtime from '@voiceflow/realtime-sdk';
import { ClickableText, Input, SectionV2, StrictPopperModifiers, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import { CUSTOM_SLOT_TYPE } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks/redux';
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
    const [hasExtendedEntity, setHasExtendedEntity] = useLinkedState(!!values.length);

    const platform = useSelector(ProjectV2.active.platformSelector);

    const isCustomSlot = type === CUSTOM_SLOT_TYPE;

    return (
      <>
        {withNameSection && (
          <>
            <SectionV2.SimpleContentSection
              isAccent
              headerProps={{ bottomUnit: 1.5 }}
              contentProps={{ bottomOffset: 0 }}
              header={
                <SectionV2.Title bold secondary>
                  Name
                </SectionV2.Title>
              }
            >
              <Input
                ref={ref}
                value={name}
                onBlur={() => saveName?.()}
                placeholder="Enter entity name"
                onChangeText={(text) => updateName(applySlotNameFormatting(platform)(text))}
              />
            </SectionV2.SimpleContentSection>
          </>
        )}

        <TypeAndColorSection
          name={name}
          type={type}
          color={color}
          saveColor={saveColor}
          onChangeType={updateType}
          colorPopperModifiers={colorPopperModifiers}
        />

        {isCustomSlot || hasExtendedEntity ? (
          <>
            <SectionV2.Divider />

            <ValuesSection type={type} name={name} inputs={values} onChange={(inputs) => saveValues?.(inputs)} />
          </>
        ) : (
          <MessageWrapper>
            <BuiltInIntentMessage>
              Entities with built-in types don't require additional sample values. If you'd like to add more you can{' '}
              <ClickableText onClick={() => setHasExtendedEntity(true)}>extend the entity.</ClickableText>
            </BuiltInIntentMessage>
          </MessageWrapper>
        )}

        {withBottomDivider && <DividerBorder />}
      </>
    );
  }
);

export default EntityForm;
