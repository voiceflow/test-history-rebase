import React from 'react';

import { SlotRequiredMessage } from '@/components/IntentSlotForm/components';
import Section from '@/componentsV2/Section';
import { SlotTag } from '@/componentsV2/VariableTag';
import { styled } from '@/hocs';

export const SlotWrapper = styled(Section)`
  display: block;
  cursor: pointer;
`;

const DraggableSlotItem = ({ itemKey, onClick, item, slotsMap, intentSlotsMap, isDragging, isDraggingPreview }, ref) => {
  const slot = slotsMap[item];
  const intentSlot = intentSlotsMap[item];

  if (!intentSlot) {
    return null;
  }

  return (
    <SlotWrapper
      key={itemKey}
      ref={ref}
      prefix={<SlotTag color={slot.color}>{slot.name}</SlotTag>}
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
