import _sortBy from 'lodash/sortBy';
import React from 'react';
import { createSelector } from 'reselect';

import { noIntentsGraphic } from '@/assets';
import { Scrollbars } from '@/components/CustomScrollbars';
import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import SearchableList from '@/components/SearchableList';
import * as IntentDuck from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks';
import { Intent } from '@/models';
import { ConnectedProps } from '@/types';
import { applyIntentNameChanges, applyIntentsNameChanges, formatIntentName, isCustomizableBuiltInIntent } from '@/utils/intent';
import { isGeneralPlatform } from '@/utils/typeGuards';

import EmptyContainer from '../EmptyContainer';
import LeftColumn from '../LeftColumn';
import RightColumn from '../RightColumn';
import { DraggableItem, Manager } from './components';

export interface IntentsManagerProps {
  selectedID?: string;
  setSelectedID: (id: string) => void;
}

const IntentsManager: React.FC<IntentsManagerProps & ConnectedIntentsManagerProps> = ({
  intents,
  createIntent,
  selectedID = intents[0]?.id,
  intentIDs,
  deleteIntent,
  setSelectedID,
  platform,
}) => {
  const [isDragging, startDragging, stopDragging] = useEnableDisable(false);
  const managerRef = React.useRef<{ resetPath: () => void }>(null);
  const isGeneral = isGeneralPlatform(platform);
  const scrollbarsRef = React.useRef<Scrollbars>(null);

  const getItemKey = React.useCallback((item: Intent) => item.id, []);
  const getItemLabel = React.useCallback((item: Intent) => applyIntentNameChanges(item.name), []);

  const renamedIntents = React.useMemo(() => applyIntentsNameChanges(intents), [intents]);

  const updateSelected = React.useCallback(
    (id: string) => {
      setSelectedID(id);
      managerRef.current?.resetPath();
    },
    [setSelectedID]
  );

  const onDelete = React.useCallback(
    (index: string | number, { item }: { item: Intent }) => {
      deleteIntent(item.id);

      if (selectedID === item.id) {
        updateSelected(intentIDs[index === 0 ? 1 : 0]);
      }
    },
    [intentIDs, selectedID]
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

  const addNewIntent = React.useCallback(() => {
    updateSelected(createIntent());
  }, []);

  return (
    <>
      <LeftColumn isDragging={isDragging}>
        <DraggableList
          type="intents"
          onDrop={stopDragging}
          onDelete={onDelete}
          itemProps={{ withoutHover: isDragging, selectedID, onSelectIntent: updateSelected }}
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
              items={renamedIntents}
              onAdd={addNewIntent}
              onChange={onChange}
              getLabel={getItemLabel}
              addMessage="New Intent"
              renderItem={(item, index) => renderItem({ key: item.id, itemKey: item.id, item, index })}
              formatValue={isGeneral ? undefined : formatIntentName}
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

const sortedIntentsSelector = createSelector(IntentV2.allCustomIntentsSelector, (intents) =>
  _sortBy(intents, isCustomizableBuiltInIntent, (intent) => intent.name.toLowerCase())
);

const mapStateToProps = {
  intents: sortedIntentsSelector,
  intentIDs: IntentV2.allIntentIDsSelector,
  platform: ProjectV2.active.platformSelector,
};

const mapDispatchToProps = {
  createIntent: IntentDuck.createIntent,
  deleteIntent: IntentDuck.deleteIntent,
};

type ConnectedIntentsManagerProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(IntentsManager) as React.FC<IntentsManagerProps>;
