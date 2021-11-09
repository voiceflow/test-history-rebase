import { Utils } from '@voiceflow/common';
import { toast } from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import React from 'react';
import { createSelector } from 'reselect';

import { noSlotsGraphic } from '@/assets';
import { Scrollbars } from '@/components/CustomScrollbars';
import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import SearchableList from '@/components/SearchableList';
import { ModalType } from '@/constants';
import * as IntentDuck from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as SlotDuck from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import { connect } from '@/hocs';
import { useEnableDisable, useModals } from '@/hooks';
import { Slot } from '@/models';
import { ConnectedProps } from '@/types';

import EmptyContainer from '../EmptyContainer';
import LeftColumn from '../LeftColumn';
import RightColumn from '../RightColumn';
import { DraggableItem, Manager } from './components';

export interface SlotsManagerProps {
  selectedID?: string;
  setSelectedID: (id: string) => void;
}

const SlotsManager: React.FC<SlotsManagerProps & ConnectedSlotsManagerProps> = ({
  slots,
  createSlot,
  slotsIDs,
  deleteSlot,
  selectedID = slots[0]?.id,
  setSelectedID,
  intentsUsingSlot,
  removeIntentSlot,
}) => {
  const { toggle: toggleSlotEdit, close: closeSlotEdit } = useModals(ModalType.SLOT_EDIT);
  const [isDragging, startDragging, stopDragging] = useEnableDisable(false);

  const scrollbarsRef = React.useRef<Scrollbars>(null);

  const getItemKey = React.useCallback((item: Slot) => item.id, []);
  const getItemLabel = React.useCallback((item: Slot) => item.name, []);
  const onDelete = React.useCallback(
    (index: string | number, { item }: { item: Slot }) => {
      const activeIntents = intentsUsingSlot(item.id);

      if (activeIntents.length > 0) {
        activeIntents.forEach((intent) => removeIntentSlot(intent.id, item.id));

        toast.info('Utterances containing this entity have been modified to remove the slot reference.');
      }

      deleteSlot(item.id);

      if (selectedID === item.id) {
        setSelectedID(slotsIDs[index === 0 ? 1 : 0]);
      }
    },
    [slotsIDs, selectedID, setSelectedID]
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
    [selectedID, setSelectedID]
  );

  const addNewSlot = React.useCallback(() => {
    toggleSlotEdit({
      isCreate: true,
      onSave: ({ type, name, color, inputs = [] }: Slot) => {
        const id = Utils.id.cuid.slug();

        createSlot(id, { id, type, name, color, inputs });
        closeSlotEdit();
        setSelectedID(id);
      },
    });
  }, [setSelectedID]);

  return (
    <>
      <LeftColumn isDragging={isDragging}>
        <DraggableList
          type="slots"
          onDrop={stopDragging}
          onDelete={onDelete}
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
              onAdd={addNewSlot}
              addMessage="New Entity"
              onChange={onFilter}
              getLabel={getItemLabel}
              renderItem={(item: Slot, index) => renderItem({ item, index, itemKey: item.id, key: item.id })}
              placeholder="Search Entities"
            />
          )}
        </DraggableList>
      </LeftColumn>

      <RightColumn>
        {!slots.length ? (
          <EmptyContainer>
            <img src={noSlotsGraphic} height={64} alt="no entities" />
            <p>Your project doesn’t contain any Entities</p>
          </EmptyContainer>
        ) : (
          <Manager id={selectedID} removeSlot={onDeleteFromManager} />
        )}
      </RightColumn>
    </>
  );
};

const sortedSlotsSelector = createSelector(SlotV2.allSlotsSelector, (slots) => _sortBy(slots, (slot) => slot.name.toLowerCase()));

const mapStateToProps = {
  slots: sortedSlotsSelector,
  slotsIDs: SlotV2.allSlotIDsSelector,
  intentsUsingSlot: IntentV2.intentsUsingSlotSelector,
};

const mapDispatchToProps = {
  createSlot: SlotDuck.createSlot,
  deleteSlot: SlotDuck.deleteSlot,
  removeIntentSlot: IntentDuck.removeIntentSlot,
};

type ConnectedSlotsManagerProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(SlotsManager) as React.FC<SlotsManagerProps>;
