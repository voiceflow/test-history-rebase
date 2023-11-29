import { BaseModels } from '@voiceflow/base-types';
import { Entity, Intent } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Flex, SvgIcon, System, Tag, Tooltip } from '@voiceflow/ui';
import React from 'react';

import Section, { Header, HeaderContent, StatusContent } from '@/components/Section';
import { styled } from '@/hocs/styled';
import { useGetOneEntityByIDSelector } from '@/hooks/entity.hook';
import { useConfirmModal } from '@/hooks/modal.hook';

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

  ${SvgIcon.Container} {
    color: #949db0;
    margin: 0 5px;
  }
`;

interface LegacyMappingsProps {
  intent: Platform.Base.Models.Intent.Model | Intent | null;
  mappings?: BaseModels.SlotMapping[];
  isNested?: boolean;
  onDelete: VoidFunction;
}

const LegacyMappings: React.FC<LegacyMappingsProps> = ({ intent, onDelete, mappings = [], isNested = false }) => {
  const getSlotByID = useGetOneEntityByIDSelector();

  const confirmModal = useConfirmModal();

  const validMappings = React.useMemo(
    () =>
      mappings.reduce<{ variable: string; slot: Realtime.Slot | Entity }[]>((acc, { variable, slot: slotID }) => {
        const slot = getSlotByID({ id: slotID });

        if (slot?.name && slot.name !== variable) {
          acc.push({ variable: variable ?? '', slot });
        }

        return acc;
      }, []),
    [getSlotByID, mappings]
  );

  const confirmDelete = () =>
    confirmModal.openVoid({
      header: 'Delete Legacy Mappings',

      body: 'Please ensure all usages of mapped variables have been replaced by the original slot.',

      confirm: onDelete,

      confirmButtonText: 'Delete',
    });

  if (validMappings.length === 0 || !intent) {
    return null;
  }

  return (
    <LegacySection
      header="Legacy Mappings"
      suffix={<System.Link.Button onClick={confirmDelete}>delete</System.Link.Button>}
      tooltip={
        <>
          <Tooltip.Paragraph marginBottomUnits={2}>
            Voiceflow now uses slots and variables interchangeably - anywhere that you can use a variable you can also use a slot.
          </Tooltip.Paragraph>

          <Tooltip.Paragraph marginBottomUnits={2}>
            If you are seeing this section it is because you have previously assigned/mapped slots into variables.
          </Tooltip.Paragraph>

          <Tooltip.Paragraph marginBottomUnits={2}>
            It is recommended to replace all usages of mapped variables with the slot directly or create a follow up <b>Set</b> block that does the
            mapping.
          </Tooltip.Paragraph>

          <Tooltip.Paragraph marginBottomUnits={2}>
            Mappings will eventually no longer be supported and this can cause issues with future versions of your assistant.
          </Tooltip.Paragraph>
        </>
      }
      isNested={isNested}
      isDividerNested
    >
      {validMappings.map(({ variable, slot }, index) => (
        <LegacyMappingRow key={index}>
          <Tag color={slot.color}>{`{${slot.name}}`}</Tag>
          <SvgIcon icon="next" />
          <Tag>{`{${variable}}`}</Tag>
        </LegacyMappingRow>
      ))}
    </LegacySection>
  );
};

export default LegacyMappings;
