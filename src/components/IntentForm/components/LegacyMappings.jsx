import React from 'react';

import Icon, { SvgIconContainer } from '@/components/SvgIcon';
import Flex from '@/componentsV2/Flex';
import Section, { Header, HeaderContent, StatusContent } from '@/componentsV2/Section';
import ClickableText from '@/componentsV2/Text/ClickableText';
import { Paragraph } from '@/componentsV2/Tooltip';
import { SlotTag, VariableTag } from '@/componentsV2/VariableTag';
import { setConfirm } from '@/ducks/modal';
import * as Slot from '@/ducks/slot';
import { connect, styled } from '@/hocs';

// TODO: Deprecate this component once legacy mapping is completely deprecated

const LegacySection = styled(Section)`
  ${Header} {
    padding-bottom: 12px;
  }
  ${HeaderContent} {
    color: #949db0;
  }
  ${StatusContent} {
    font-size: 15px;
  }

  padding-bottom: 12px;
`;

const LegacyMappingRow = styled(Flex)`
  opacity: 0.5;
  ${SvgIconContainer} {
    color: #949db0;
    margin: 0 5px;
  }
  margin-bottom: 6px;
`;

function LegacyMappings({ intent, setConfirm, onDelete, slotByID, mappings = [], isNested = false }) {
  const validMappings = React.useMemo(
    () =>
      mappings.reduce((acc, { variable, slot: slotID }) => {
        const slot = slotByID(slotID);
        if (slot?.name && slot.name !== variable) {
          acc.push({ variable, slot });
        }
        return acc;
      }, []),
    [mappings]
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
      suffix={<ClickableText onClick={confirmDelete}>delete</ClickableText>}
    >
      {validMappings.map(({ variable, slot }, index) => (
        <LegacyMappingRow key={index}>
          <SlotTag color={slot.color}>{slot.name}</SlotTag>
          <Icon icon="next" />
          <VariableTag>{`{${variable}}`}</VariableTag>
        </LegacyMappingRow>
      ))}
    </LegacySection>
  );
}

const mapStateToProps = {
  slotByID: Slot.slotByIDSelector,
};

const mapDispatchToProps = {
  setConfirm,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LegacyMappings);
