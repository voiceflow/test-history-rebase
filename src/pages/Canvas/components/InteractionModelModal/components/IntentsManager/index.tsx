import React from 'react';

import { noIntentsGraphic } from '@/assets';
import { Scrollbars } from '@/components/CustomScrollbars';
import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import SearchableList from '@/components/SearchableList';
import * as IntentDuck from '@/ducks/intent';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks';
import { Intent } from '@/models';
import { ConnectedProps } from '@/types';
import { reorder as reorderArray } from '@/utils/array';
import { formatIntentName } from '@/utils/intent';

import EmptyContainer from '../EmptyContainer';
import LeftColumn from '../LeftColumn';
import RightColumn from '../RightColumn';
import { DraggableItem, Manager } from './components';

export type IntentsManagerProps = {
  selectedID?: string;
  setSelectedID: (id: string) => void;
};

const IntentsManager: React.FC<IntentsManagerProps & ConnectedIntentsManagerProps> = ({
  intents,
  newIntent,
  selectedID = intents[0]?.id,
  intentsIDs,
  removeIntent,
  setSelectedID,
  reorderIntents,
}) => {
  const [isDragging, startDragging, stopDragging] = useEnableDisable(false);
  const managerRef = React.useRef<{ resetPath: () => void }>(null);

  const scrollbarsRef = React.useRef<Scrollbars>(null);

  const getItemKey = React.useCallback((item: Intent) => item.id, []);
  const getItemLabel = React.useCallback((item: Intent) => item.name, []);

  const updateSelected = React.useCallback(
    (id: string) => {
      setSelectedID(id);
      managerRef.current?.resetPath();
    },
    [setSelectedID]
  );

  const onDelete = React.useCallback(
    (index: string | number, { item }: { item: Intent }) => {
      removeIntent(item.id);

      if (selectedID === item.id) {
        updateSelected(intentsIDs[index === 0 ? 1 : 0]);
      }
    },
    [removeIntent, intentsIDs, selectedID]
  );

  const onDeleteFromManager = React.useCallback(
    (id: string) => {
      const index = intents.findIndex((intent) => intent.id === id);

      onDelete(index, { item: intents[index] });
    },
    [onDelete, intents]
  );

  const onChange = React.useCallback(
    (_, items: Intent[]) => {
      if (!items.some(({ id }) => id === selectedID)) {
        updateSelected(items[0]?.id);
      }
    },
    [selectedID]
  );

  const onReorder = React.useCallback((from: number, to: number) => reorderIntents(reorderArray(intentsIDs, from, to)), [intentsIDs, reorderIntents]);

  const addNewIntent = React.useCallback(() => {
    updateSelected(newIntent());
  }, [newIntent]);

  return (
    <>
      <LeftColumn isDragging={isDragging}>
        <DraggableList
          type="intents"
          onDrop={stopDragging}
          onDelete={onDelete}
          onReorder={onReorder}
          itemProps={{ withoutHover: isDragging, selectedID, onSelectIntent: updateSelected }}
          onEndDrag={stopDragging}
          getItemKey={getItemKey}
          onStartDrag={startDragging}
          itemComponent={DraggableItem}
          deleteComponent={DeleteComponent}
          previewComponent={DraggableItem}
          renderDeleteDelayed
          unmountableDuringDrag
          withContextMenuDelete
        >
          {({ renderItem }) => (
            <SearchableList
              ref={scrollbarsRef}
              items={intents}
              onAdd={addNewIntent}
              onChange={onChange}
              getLabel={getItemLabel}
              addMessage="New Intent"
              renderItem={(item, index) => renderItem({ key: item.id, itemKey: item.id, item, index })}
              formatValue={formatIntentName}
              placeholder="Search Intents"
            />
          )}
        </DraggableList>
      </LeftColumn>

      <RightColumn>
        {!intents.length ? (
          <EmptyContainer>
            <img src={noIntentsGraphic} height={64} alt="no intents" />
            <p>Your project doesn’t contain any Intents</p>
          </EmptyContainer>
        ) : (
          <Manager id={selectedID} removeIntent={onDeleteFromManager} ref={managerRef} />
        )}
      </RightColumn>
    </>
  );
};

const mapStateToProps = {
  intents: IntentDuck.allIntentsSelector,
  intentsMap: IntentDuck.mapIntentsSelector,
  intentsIDs: IntentDuck.allIntentIDsSelector,
};

const mapDispatchToProps = {
  newIntent: IntentDuck.newIntent,
  removeIntent: IntentDuck.removeIntent,
  reorderIntents: IntentDuck.reorderIntents,
};

type ConnectedIntentsManagerProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(IntentsManager) as React.FC<IntentsManagerProps>;
