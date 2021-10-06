import { IconVariant, SvgIcon, useConst, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import { List as VirtualizedList } from 'react-virtualized';

import { Scrollbars } from '@/components/CustomScrollbars';
import DraggableList from '@/components/DraggableList';
import { DragItem } from '@/constants';
import { useDidUpdateEffect } from '@/hooks';
import { getTargetValue } from '@/utils/dom';

import Header, { HEADER_MIN_HEIGHT } from '../Header';
import List from '../List';
import SearchInput, { SEARCH_INPUT_HEIGHT } from '../SearchInput';
import { INTENT_LIST_OFFSET, ITEM_INTENT_HEIGHT, TOPIC_ITEM_HEIGHT, TopicItem as TopicItemComponent } from './components';
import { TopicItem, useTopics, useTopicsToggle } from './hooks';

const SEARCHABLE_TOPICS_COUNT = 6;
const SEARCHABLE_INTENTS_COUNT = 10;

const TopicsSection: React.FC = () => {
  const listRef = React.useRef<VirtualizedList>(null);
  const scrollBarsRef = React.useRef<Scrollbars>(null);
  const { isDragging, onDragEnd, onDragStart, openedTopics, onToggleTopicOpen } = useTopicsToggle();
  const {
    topicsItems,
    searchValue,
    onCreateTopic,
    rootDiagramID,
    focusedNodeID,
    setSearchValue,
    activeDiagramID,
    onReorderTopics,
    searchMatchValue,
    searchTopicsItems,
    searchOpenedTopics,
    lastCreatedDiagramID,
    onClearLastCreatedDiagramID,
  } = useTopics();

  const isSearch = !!searchMatchValue;

  const topics = isSearch ? searchTopicsItems : topicsItems;
  const opened = isSearch ? searchOpenedTopics : openedTopics;

  const rowHeight = React.useCallback(
    ({ index }: { index: number }) => {
      const topic = topics[index];
      const isOpened = opened[topic.id];

      if (!isOpened) {
        return TOPIC_ITEM_HEIGHT;
      }

      const childSize = topic.intentItems.length + (!isSearch && rootDiagramID === topic.id ? 1 : 0);

      return TOPIC_ITEM_HEIGHT + INTENT_LIST_OFFSET * 2 + ITEM_INTENT_HEIGHT * (childSize || 1);
    },
    [opened, topics, rootDiagramID]
  );

  const canDrag = usePersistFunction(() => !isSearch);
  const getItemKey = useConst((item: TopicItem) => item.id);

  const withSearch = React.useMemo(() => {
    if (isSearch || topics.length >= SEARCHABLE_TOPICS_COUNT) return true;

    let intentsCount = 0;

    // eslint-disable-next-line no-return-assign
    return topics.some((topic) => (intentsCount += topic.intentItems.length) >= SEARCHABLE_INTENTS_COUNT);
  }, [topics, isSearch]);

  useDidUpdateEffect(() => {
    listRef.current?.recomputeRowHeights();
  }, [opened, topics]);

  useDidUpdateEffect(() => {
    const index = topics.findIndex(({ id }) => id === lastCreatedDiagramID);

    if (index !== -1) {
      const offset = Array.from({ length: index + 1 }).reduce<number>((acc, _, i) => acc + rowHeight({ index: i }), 0);

      scrollBarsRef.current?.scrollTop(offset + HEADER_MIN_HEIGHT + (withSearch ? SEARCH_INPUT_HEIGHT : 0));
    }
  }, [lastCreatedDiagramID]);

  return (
    <DraggableList
      type={DragItem.TOPICS}
      canDrag={canDrag}
      itemProps={{
        isSearch,
        onToggleOpen: onToggleTopicOpen,
        disableHover: isDragging,
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
        <List
          ref={scrollBarsRef}
          size={topics.length}
          header={
            <Header label="Topics" rightAction={<SvgIcon icon="addTopic" variant={IconVariant.STANDARD} clickable onClick={onCreateTopic} />}>
              {withSearch ? <SearchInput value={searchValue} onChange={getTargetValue(setSearchValue)} placeholder="Search" /> : null}
            </Header>
          }
          listRef={listRef}
          rowHeight={rowHeight}
          renderItem={(index) => {
            const item = topics[index];

            return renderItem({ key: item.id, itemKey: item.id, item, index });
          }}
        />
      )}
    </DraggableList>
  );
};

export default TopicsSection;
