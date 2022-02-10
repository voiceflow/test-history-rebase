import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { ClickableText, Flex, SvgIcon, SvgIconContainer } from '@voiceflow/ui';
import React from 'react';

import Section, { Header, HeaderContent, StatusContent } from '@/components/Section';
import { Paragraph } from '@/components/Tooltip';
import { SlotTag, VariableTag } from '@/components/VariableTag';
import * as Modal from '@/ducks/modal';
import * as SlotV2 from '@/ducks/slotV2';
import { styled } from '@/hocs';
import { useDispatch, useSelector } from '@/hooks';

// TODO: Deprecate this component once legacy mapping is completely deprecated

const LegacySection = styled(Section)`
  padding-bottom: 12px;

  ${Header} {
    padding-bottom: 12px;
  }

  ${HeaderContent} {
    color: #949db0;
  }

  ${StatusContent} {
    font-size: 15px;
  }
`;

const LegacyMappingRow = styled(Flex)`
  opacity: 0.5;
  margin-bottom: 6px;

  ${SvgIconContainer} {
    color: #949db0;
    margin: 0 5px;
  }
`;

interface LegacyMappingsProps {
  intent: Realtime.Intent | null;
  mappings?: BaseModels.SlotMapping[];
  isNested?: boolean;
  onDelete: VoidFunction;
}

const LegacyMappings: React.FC<LegacyMappingsProps> = ({ intent, onDelete, mappings = [], isNested = false }) => {
  const getSlotByID = useSelector(SlotV2.getSlotByIDSelector);
  const setConfirm = useDispatch(Modal.setConfirm);

  const validMappings = React.useMemo(
    () =>
      mappings.reduce<{ variable: string; slot: Realtime.Slot }[]>((acc, { variable, slot: slotID }) => {
        const slot = getSlotByID({ id: slotID });

        if (slot?.name && slot.name !== variable) {
          acc.push({ variable: variable ?? '', slot });
        }

        return acc;
      }, []),
    [getSlotByID, mappings]
  );

  const confirmDelete = React.useCallback(
    () =>
      setConfirm({
        warning: true,
        text: 'Please ensure all usages of mapped variables have been replaced by the original slot. Delete mapping?',
        confirm: onDelete,
      }),
    [onDelete]
  );

  if (validMappings.length === 0 || !intent) {
    return null;
  }

  return (
    <LegacySection
      header="Legacy Mappings"
      suffix={<ClickableText onClick={confirmDelete}>delete</ClickableText>}
      tooltip={
        <>
          <Paragraph marginBottomUnits={2}>
            Voiceflow now uses slots and variables interchangeably - anywhere that you can use a variable you can also use a slot.
          </Paragraph>
          <Paragraph marginBottomUnits={2}>
            If you are seeing this section it is because you have previously assigned/mapped slots into variables.
          </Paragraph>
          <Paragraph marginBottomUnits={2}>
            It is recommended to replace all usages of mapped variables with the slot directly or create a follow up <b>Set</b> block that does the
            mapping.
          </Paragraph>
          <Paragraph marginBottomUnits={2}>
            Mappings will eventually no longer be supported and this can cause issues with future versions of your project.
          </Paragraph>
        </>
      }
      isNested={isNested}
      isDividerNested
    >
      {validMappings.map(({ variable, slot }, index) => (
        <LegacyMappingRow key={index}>
          <SlotTag color={slot.color}>{slot.name}</SlotTag>
          <SvgIcon icon="next" />
          <VariableTag>{variable}</VariableTag>
        </LegacyMappingRow>
      ))}
    </LegacySection>
  );
};

export default LegacyMappings;
