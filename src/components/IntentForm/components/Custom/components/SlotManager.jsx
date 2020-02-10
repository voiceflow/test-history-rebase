import React from 'react';

import ChatWithUsLink from '@/components/ChatLink';
import DraggableList from '@/components/DraggableList';
import { SectionToggleVariant } from '@/components/Section';
import * as Intent from '@/ducks/intent';
import * as Slot from '@/ducks/slot';
import { connect } from '@/hocs';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { reorder } from '@/utils/array';

import DraggableSlotItem from './DraggableSlotItem';
import SlotsTooltip from './SlotsTooltip';

function SlotManager({ intent, slotsMap, reorderIntentSlots, pushToPath, isNested }) {
  const intentID = intent.id;
  const allSlotKeys = intent.slots.allKeys;

  const [reorderableSlots, updateReorderableSlots] = React.useState(allSlotKeys || []);

  const slotCount = reorderableSlots.length;

  const onItemClick = React.useCallback((id) => pushToPath({ id, type: 'slot', label: slotsMap[id].name, intentID }), [
    intentID,
    pushToPath,
    slotsMap,
  ]);

  const onReorderSlot = React.useCallback((dragIndex, hoverIndex) => updateReorderableSlots(reorder(reorderableSlots, dragIndex, hoverIndex)), [
    reorderableSlots,
    updateReorderableSlots,
  ]);

  const onDropSlot = React.useCallback(() => reorderIntentSlots(intentID, reorderableSlots), [reorderIntentSlots, intentID, reorderableSlots]);

  React.useEffect(() => updateReorderableSlots(allSlotKeys || []), [allSlotKeys, updateReorderableSlots]);

  return (
    <EditorSection
      namespace="slots"
      header="Slots"
      count={slotCount}
      tooltip={<SlotsTooltip />}
      headerToggle={!!slotCount}
      isNested={isNested}
      isDividerNested
      tooltipProps={{
        helpMessage: (
          <>
            <ChatWithUsLink>Live chat</ChatWithUsLink> with someone on the Voiceflow team.
          </>
        ),
        contentBottomUnits: 1.5,
      }}
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

const mapStateToProps = {
  slotsMap: Slot.mapSlotsSelector,
};

const mapDispatchToProps = {
  reorderIntentSlots: Intent.reorderIntentSlots,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SlotManager);
