import React from 'react';

import { Scrollbars } from '@/components/CustomScrollbars';
import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import SearchableList from '@/components/SearchableList';
import SvgIcon from '@/components/SvgIcon';
import * as SlotDuck from '@/ducks/slot';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks';
import { reorder as reorderArray } from '@/utils/array';

import EmptyContainer from '../EmptyContainer';
import LeftColumn from '../LeftColumn';
import RightColumn from '../RightColumn';
import { DraggableItem, Manager } from './components';
import { Slot } from './types';

export type SlotsManagerProps = {
  slots: Slot[];
  addSlot: (id: string, slot: Slot) => void;
  slotsIDs: string[];
  removeSlot: (id: string) => void;
  reorderSlots: (ids: string[]) => void;
};

const SlotsManager: React.FC<SlotsManagerProps> = ({ slots, slotsIDs, removeSlot, reorderSlots }) => {
  const [selectedID, setSelectedID] = React.useState(slots[0]?.id);
  const [isDragging, startDragging, stopDragging] = useEnableDisable(false);

  const scrollbarsRef = React.useRef<Scrollbars>(null);

  const getItemKey = React.useCallback((item: Slot) => item.id, []);
  const getItemLabel = React.useCallback((item: Slot) => item.name, []);

  const onDelete = React.useCallback(
    (index: string | number, { item }: { item: Slot }) => {
      removeSlot(item.id);

      if (selectedID === item.id) {
        setSelectedID(slotsIDs[index === 0 ? 1 : 0]);
      }
    },
    [removeSlot, slotsIDs, selectedID]
  );

  const onDeleteFromManager = React.useCallback(
    (id: string) => {
      const index = slots.findIndex((slot) => slot.id === id);

      onDelete(index, { item: slots[index] });
    },
    [onDelete, slots]
  );

  const onFilter = React.useCallback(
    (_, items: Slot[]) => {
      if (!items.some(({ id }) => id === selectedID)) {
        setSelectedID(items[0]?.id);
      }
    },
    [selectedID]
  );

  const onReorder = React.useCallback((from: number, to: number) => reorderSlots(reorderArray(slotsIDs, from, to)), [slotsIDs, reorderSlots]);

  return !slots.length ? (
    <EmptyContainer>
      <SvgIcon icon="noSlots" size={64} />
      <p>Your project doesn’t contain any Slots</p>
    </EmptyContainer>
  ) : (
    <>
      <LeftColumn>
        <DraggableList
          type="slots"
          onDrop={stopDragging}
          onDelete={onDelete}
          onReorder={onReorder}
          itemProps={{ withoutHover: isDragging, selectedID, onSelectSlot: setSelectedID }}
          onEndDrag={stopDragging}
          getItemKey={getItemKey}
          onStartDrag={startDragging}
          itemComponent={DraggableItem}
          deleteComponent={DeleteComponent}
          previewComponent={DraggableItem}
          unmountableDuringDrag
          withContextMenuDelete
        >
          {({ renderItem }) => (
            <SearchableList
              ref={scrollbarsRef}
              items={slots}
              onChange={onFilter}
              getLabel={getItemLabel}
              renderItem={(item: Slot, index) => renderItem({ item, index, itemKey: item.id, key: item.id })}
              placeholder="Search Slots"
            />
          )}
        </DraggableList>
      </LeftColumn>

      <RightColumn withTopPadding>
        <Manager id={selectedID} removeSlot={onDeleteFromManager} />
      </RightColumn>
    </>
  );
};

const mapStateToProps = {
  slots: SlotDuck.allSlotsSelector,
  slotsMap: SlotDuck.mapSlotsSelector,
  slotsIDs: SlotDuck.allSlotIDsSelector,
};

const mapDispatchToProps = {
  addSlot: SlotDuck.addSlot,
  removeSlot: SlotDuck.removeSlot,
  reorderSlots: SlotDuck.reorderSlots,
};

export default connect(mapStateToProps, mapDispatchToProps)(SlotsManager);
