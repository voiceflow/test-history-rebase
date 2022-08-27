import { CustomScrollbarsTypes, IconButton, TippyTooltip, useConst, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import { List } from 'react-virtualized';

import DraggableList from '@/components/DraggableList';
import VirtualList from '@/components/VirtualList';
import { Permission } from '@/config/permissions';
import { DragItem } from '@/constants';
import { useDidUpdateEffect, usePermission } from '@/hooks';
import { withTargetValue } from '@/utils/dom';

import Header from '../../Header';
import { HEADER_MIN_HEIGHT, ITEM_HEIGHT } from '../constants';
import SearchInput, { SEARCH_INPUT_HEIGHT } from '../SearchInput';
import { TopicItem, useTopics } from './hooks';
import TopicItemComponent from './TopicItem';

const TOPIC_ITEM_HEIGHT = ITEM_HEIGHT;

const TopicsSection: React.FC = () => {
  const listRef = React.useRef<List>(null);
  const scrollBarsRef = React.useRef<CustomScrollbarsTypes.Scrollbars>(null);

  const [canReorder] = usePermission(Permission.REORDER_TOPICS_AND_COMPONENTS);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  const {
    openedIDs,
    onDragEnd,
    topicsItems,
    searchValue,
    onDragStart,
    onCreateTopic,
    rootDiagramID,
    focusedNodeID,
    setSearchValue,
    activeDiagramID,
    onReorderTopics,
    onToggleOpenedID,
    searchMatchValue,
    searchTopicsItems,
    searchOpenedTopics,
    lastCreatedDiagramID,
    onClearLastCreatedDiagramID,
  } = useTopics();

  const isSearch = !!searchMatchValue;

  const topics = isSearch ? searchTopicsItems : topicsItems;
  const opened = isSearch ? searchOpenedTopics : openedIDs;

  const rowHeight = usePersistFunction(({ index }: { index: number }) => {
    const topic = topics[index];
    const isOpened = opened[topic.id];

    if (!isOpened) {
      return TOPIC_ITEM_HEIGHT;
    }

    return TOPIC_ITEM_HEIGHT + ITEM_HEIGHT * (topic.menuItems.length || 1);
  });

  const canDrag = usePersistFunction(() => !isSearch && canReorder);
  const getItemKey = useConst((item: TopicItem) => item.id);

  useDidUpdateEffect(() => {
    listRef.current?.recomputeRowHeights();
  }, [opened, topics]);

  useDidUpdateEffect(() => {
    const index = topics.findIndex(({ id }) => id === lastCreatedDiagramID);

    if (index !== -1) {
      const offset = Array.from({ length: index + 1 }).reduce<number>((acc, _, i) => acc + rowHeight({ index: i }), 0);

      scrollBarsRef.current?.scrollTop(offset + HEADER_MIN_HEIGHT + SEARCH_INPUT_HEIGHT);
    }
  }, [lastCreatedDiagramID]);

  return (
    <DraggableList
      type={DragItem.TOPICS}
      canDrag={canDrag}
      itemProps={{
        isSearch,
        onToggleOpen: onToggleOpenedID,
        openedTopics: opened,
        focusedNodeID,
        rootDiagramID,
        activeDiagramID,
        searchMatchValue,
        lastCreatedDiagramID,
        onClearLastCreatedDiagramID,
      }}
      onReorder={onReorderTopics}
      onEndDrag={onDragEnd}
      getItemKey={getItemKey}
      onStartDrag={onDragStart}
      itemComponent={TopicItemComponent}
      previewComponent={TopicItemComponent}
      unmountableDuringDrag
    >
      {({ renderItem }) => (
        <VirtualList
          ref={scrollBarsRef}
          size={topics.length}
          header={
            <Header
              label="Topics"
              rightAction={
                canEditCanvas && (
                  <TippyTooltip title="Create topic" delay={500}>
                    <IconButton icon="plus" variant={IconButton.Variant.BASIC} onClick={onCreateTopic} offsetSize={0} />
                  </TippyTooltip>
                )
              }
            >
              <SearchInput value={searchValue} onChange={withTargetValue(setSearchValue)} placeholder="Search" />
            </Header>
          }
          listRef={listRef}
          rowHeight={rowHeight}
          renderItem={(index) => {
            const item = topics[index];

            return renderItem({
              key: item.id,
              item,
              index,
              isLast: index === topics.length - 1,
              isFirst: index === 0,
              itemKey: item.id,
            });
          }}
        />
      )}
    </DraggableList>
  );
};

export default TopicsSection;
