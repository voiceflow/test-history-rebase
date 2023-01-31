import { CustomScrollbarsTypes, System, TippyTooltip, useConst, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import { VariableSizeList } from 'react-window';

import DraggableList from '@/components/DraggableList';
import VirtualList from '@/components/VirtualList';
import { DragItem } from '@/constants';
import { Permission } from '@/constants/permissions';
import { useDidUpdateEffect, usePermission } from '@/hooks';

import Header from '../../Header';
import { HEADER_MIN_HEIGHT, ITEM_HEIGHT } from '../constants';
import SearchInput, { SEARCH_INPUT_HEIGHT } from '../SearchInput';
import { TopicItem, useTopics } from './hooks';
import TopicItemComponent from './TopicItem';
import VirtualListItem from './VirtualListItem';

const TopicsSection: React.OldFC = () => {
  const listRef = React.useRef<VariableSizeList<TopicItem[]>>(null);
  const scrollBarsRef = React.useRef<CustomScrollbarsTypes.Scrollbars>(null);

  const [canReorder] = usePermission(Permission.REORDER_TOPICS_AND_COMPONENTS);
  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);

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

  const canDrag = usePersistFunction(() => !isSearch && canReorder);
  const getDNDItemKey = useConst((item: TopicItem) => item.id);
  const getVirtualItemKey = useConst((index: number, data: TopicItem[]) => data[index].id);
  const itemSize = React.useCallback(
    (index: number) => {
      const topic = topics[index];
      const isOpened = opened[topic.id];

      if (!isOpened) {
        return ITEM_HEIGHT;
      }

      return ITEM_HEIGHT + ITEM_HEIGHT * (topic.menuItems.length || 1);
    },
    [openedIDs, topics]
  );

  useDidUpdateEffect(() => {
    listRef.current?.resetAfterIndex(0);
  }, [opened, topics]);

  useDidUpdateEffect(() => {
    const index = topics.findIndex(({ id }) => id === lastCreatedDiagramID);

    if (index !== -1) {
      const offset = Array.from({ length: index + 1 }).reduce<number>((acc, _, index) => acc + itemSize(index), 0);

      scrollBarsRef.current?.scrollTop?.(offset + HEADER_MIN_HEIGHT + SEARCH_INPUT_HEIGHT);
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
      getItemKey={getDNDItemKey}
      onStartDrag={onDragStart}
      itemComponent={TopicItemComponent}
      previewComponent={TopicItemComponent}
      unmountableDuringDrag
    >
      {() => (
        <VirtualList<TopicItem[]>
          ref={listRef}
          size={topics.length}
          itemKey={getVirtualItemKey}
          itemSize={itemSize}
          listData={topics}
          scrollbarsRef={scrollBarsRef}
          itemComponent={VirtualListItem}
          estimatedItemSize={ITEM_HEIGHT}
          header={
            <Header
              label="Topics"
              rightAction={
                canEditCanvas && (
                  <TippyTooltip content="Create topic" delay={500}>
                    <System.IconButton.Base icon="plus" size={System.IconButton.Size.S} onClick={onCreateTopic} />
                  </TippyTooltip>
                )
              }
            >
              <SearchInput value={searchValue} onChangeText={setSearchValue} placeholder="Search" $onIconClick={() => setSearchValue('')} />
            </Header>
          }
        />
      )}
    </DraggableList>
  );
};

export default TopicsSection;
