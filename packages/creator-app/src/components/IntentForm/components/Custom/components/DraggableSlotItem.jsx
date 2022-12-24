import { Tag } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';
import { styled } from '@/hocs/styled';

export const SlotWrapper = styled(Section)`
  display: block;
  cursor: pointer;
`;

export const SlotMessage = styled.span`
  display: inline-block;
  color: ${({ accent }) => (accent ? '#132144' : '#8da2b5')};
  font-weight: normal;
  white-space: nowrap;
`;

const SlotRequiredMessage = ({ required }) => <SlotMessage accent={required}>{required ? 'is required' : 'is not required'}</SlotMessage>;

const DraggableSlotItem = ({ itemKey, onClick, item, slotsMap, intentSlotsMap, isDragging, isDraggingPreview }, ref) => {
  const slot = slotsMap[item];
  const intentSlot = intentSlotsMap[item];

  if (!intentSlot || !slot) {
    return null;
  }

  return (
    <SlotWrapper
      key={itemKey}
      ref={ref}
      prefix={<Tag color={slot.color}>{`{${slot.name}}`}</Tag>}
      header={<SlotRequiredMessage required={intentSlot.required} />}
      isLink
      onClick={onClick ? () => onClick(item) : undefined}
      isNested
      isDragging={isDragging}
      isDividerNested
      isDraggingPreview={isDraggingPreview}
    />
  );
};

export default React.forwardRef(DraggableSlotItem);
