import { Utils } from '@voiceflow/common';
import React from 'react';

import DraggableList from '@/components/DraggableList';
import { SectionToggleVariant } from '@/components/Section';
import * as Intent from '@/ducks/intent';
import * as SlotV2 from '@/ducks/slotV2';
import { useDispatch, useSelector } from '@/hooks';
import EditorSection from '@/pages/Canvas/components/EditorSection';

import DraggableSlotItem from './DraggableSlotItem';
import SlotsTooltip from './SlotsTooltip';

export const SLOT_PATH_TYPE = 'slot';

function SlotManager({ intent, pushToPath, isNested }) {
  const slotsMap = useSelector(SlotV2.slotMapSelector);
  const reorderIntentSlots = useDispatch(Intent.reorderIntentSlots);

  const intentID = intent.id;
  const allSlotKeys = intent.slots.allKeys;

  const [reorderableSlots, updateReorderableSlots] = React.useState(allSlotKeys || []);

  const slotCount = reorderableSlots.length;

  const onItemClick = React.useCallback(
    (id) => pushToPath({ id, type: SLOT_PATH_TYPE, label: slotsMap[id].name, intentID }),
    [intentID, pushToPath, slotsMap]
  );

  const onReorderSlot = React.useCallback(
    (dragIndex, hoverIndex) => updateReorderableSlots(Utils.array.reorder(reorderableSlots, dragIndex, hoverIndex)),
    [reorderableSlots, updateReorderableSlots]
  );

  const onDropSlot = React.useCallback(() => reorderIntentSlots(intentID, reorderableSlots), [reorderIntentSlots, intentID, reorderableSlots]);

  React.useEffect(() => updateReorderableSlots(allSlotKeys || []), [allSlotKeys, updateReorderableSlots]);

  return slotCount === 0 ? null : (
    <EditorSection
      namespace="slots"
      header="Entities"
      count={slotCount}
      tooltip={<SlotsTooltip />}
      headerToggle={!!slotCount}
      isNested={isNested}
      isDividerNested
      collapseVariant={SectionToggleVariant.ARROW}
      disabled={!slotCount}
    >
      <DraggableList
        type="intent-slots"
        items={reorderableSlots}
        onDrop={onDropSlot}
        itemProps={{ slotsMap, intentSlotsMap: intent.slots.byKey, onClick: onItemClick }}
        onReorder={onReorderSlot}
        itemComponent={DraggableSlotItem}
        previewComponent={DraggableSlotItem}
      />
    </EditorSection>
  );
}

export default SlotManager;
