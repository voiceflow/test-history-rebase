import * as Realtime from '@voiceflow/realtime-sdk';
import { Input, SectionV2, StrictPopperModifiers, System, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import { CUSTOM_SLOT_TYPE } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks/redux';
import { applySlotNameFormatting } from '@/utils/slot';

import { TypeAndColorSection, ValuesSection } from './components';
import * as S from './styles';

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
  valueError?: boolean;
  withNameSection?: boolean;
  withBottomDivider?: boolean;
  colorPopperModifiers?: StrictPopperModifiers;
}

const EntityForm: React.FC<EntityFormProps> = ({
  type,
  name,
  color,
  values,
  saveName,
  saveColor,
  updateType,
  saveValues,
  updateName,
  valueError,
  withNameSection = true,
  withBottomDivider,
  colorPopperModifiers,
}) => {
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
            width="100%"
          >
            <Input
              value={name}
              onBlur={() => saveName?.()}
              placeholder="Enter entity name"
              onChangeText={(text) => updateName(applySlotNameFormatting(platform)(text))}
              onEnterPress={(e) => e.preventDefault()}
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

          <ValuesSection type={type} name={name} inputs={values} onChange={(inputs) => saveValues?.(inputs)} error={valueError} />
        </>
      ) : (
        <S.MessageWrapper>
          <S.BuiltInIntentMessage>
            Entities with built-in types don't require additional sample values. If you'd like to add more you can{' '}
            <System.Link.Button name="extendEntity" onClick={() => setHasExtendedEntity(true)}>
              extend the entity.
            </System.Link.Button>
          </S.BuiltInIntentMessage>
        </S.MessageWrapper>
      )}

      {withBottomDivider && <SectionV2.Divider />}
    </>
  );
};

export default EntityForm;
