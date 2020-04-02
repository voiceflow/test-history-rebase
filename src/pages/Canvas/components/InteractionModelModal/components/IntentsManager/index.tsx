import React from 'react';

import { Scrollbars } from '@/components/CustomScrollbars';
import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import SearchableList from '@/components/SearchableList';
import SvgIcon from '@/components/SvgIcon';
import * as IntentDuck from '@/ducks/intent';
import { connect } from '@/hocs';
import { useEnableDisable } from '@/hooks';
import { reorder as reorderArray } from '@/utils/array';
import { formatIntentName } from '@/utils/intent';

import EmptyContainer from '../EmptyContainer';
import LeftColumn from '../LeftColumn';
import RightColumn from '../RightColumn';
import { DraggableItem, Manager } from './components';
import { Intent } from './types';

export type IntentsManagerProps = {
  intents: Intent[];
  addIntent: (id: string, intent: Intent) => void;
  intentsIDs: string[];
  removeIntent: (id: string) => void;
  reorderIntents: (ids: string[]) => void;
};

const IntentsManager: React.FC<IntentsManagerProps> = ({ intents, intentsIDs, removeIntent, reorderIntents }) => {
  const [selectedID, setSelectedID] = React.useState(intents[0]?.id);
  const [isDragging, startDragging, stopDragging] = useEnableDisable(false);

  const scrollbarsRef = React.useRef<Scrollbars>(null);

  const getItemKey = React.useCallback((item: Intent) => item.id, []);
  const getItemLabel = React.useCallback((item: Intent) => item.name, []);

  const onDelete = React.useCallback(
    (index: string | number, { item }: { item: Intent }) => {
      removeIntent(item.id);

      if (selectedID === item.id) {
        setSelectedID(intentsIDs[index === 0 ? 1 : 0]);
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

  const onFilter = React.useCallback(
    (_, items: Intent[]) => {
      if (!items.some(({ id }) => id === selectedID)) {
        setSelectedID(items[0]?.id);
      }
    },
    [selectedID]
  );

  const onReorder = React.useCallback((from: number, to: number) => reorderIntents(reorderArray(intentsIDs, from, to)), [intentsIDs, reorderIntents]);

  return !intents.length ? (
    <EmptyContainer>
      <SvgIcon icon="noIntents" size={64} />
      <p>Your project doesn’t contain any Intents</p>
    </EmptyContainer>
  ) : (
    <>
      <LeftColumn>
        <DraggableList
          type="intents"
          onDrop={stopDragging}
          onDelete={onDelete}
          onReorder={onReorder}
          itemProps={{ withoutHover: isDragging, selectedID, onSelectIntent: setSelectedID }}
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
              items={intents}
              onChange={onFilter}
              getLabel={getItemLabel}
              renderItem={(item, index) => renderItem({ key: item.id, itemKey: item.id, item, index })}
              formatValue={formatIntentName}
              placeholder="Search Intents"
            />
          )}
        </DraggableList>
      </LeftColumn>

      <RightColumn>
        <Manager id={selectedID} removeIntent={onDeleteFromManager} />
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
  addIntent: IntentDuck.addIntent,
  removeIntent: IntentDuck.removeIntent,
  reorderIntents: IntentDuck.reorderIntents,
};

export default connect(mapStateToProps, mapDispatchToProps)(IntentsManager);
