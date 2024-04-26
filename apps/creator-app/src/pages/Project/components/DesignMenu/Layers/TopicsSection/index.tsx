import { BaseModels } from '@voiceflow/base-types';
import type { CustomScrollbarsTypes } from '@voiceflow/ui';
import { System, TippyTooltip, useConst, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import type { VariableSizeList } from 'react-window';

import DraggableList from '@/components/DraggableList';
import VirtualList from '@/components/VirtualList';
import { DragItem } from '@/constants';
import { Permission } from '@/constants/permissions';
import { useDidUpdateEffect, usePermission } from '@/hooks';

import Header from '../../Header';
import { BOTTOM_PADDING, HEADER_MIN_HEIGHT, ITEM_HEIGHT, SEARCH_INPUT_HEIGHT } from '../constants';
import SearchInput from '../SearchInput';
import type { TopicItem, TopicMenuItem } from './hooks';
import { useTopics } from './hooks';
import TopicItemComponent from './TopicItem';
import VirtualListItem from './VirtualListItem';

const TopicsSection: React.FC = () => {
  const listRef = React.useRef<VariableSizeList<TopicItem[]>>(null);
  const scrollBarsRef = React.useRef<CustomScrollbarsTypes.Scrollbars>(null);

  const [canReorder] = usePermission(Permission.REORDER_TOPICS_AND_COMPONENTS);
  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);

  const {
    openedIDs,
    onDragEnd,
    topicsItems,
    searchValue,
    onAddIntent,
    onDragStart,
    onCreateTopic,
    rootDiagramID,
    focusedNodeID,
    setSearchValue,
    scrollToTopicID,
    onNestedDragEnd,
    activeDiagramID,
    onReorderTopics,
    onCreateSubtopic,
    onToggleOpenedID,
    searchMatchValue,
    searchTopicsItems,
    onNestedDragStart,
    searchOpenedTopics,
    lastCreatedDiagramID,
    onClearLastCreatedDiagramID,
  } = useTopics();

  const isSearch = !!searchMatchValue;

  const topics = isSearch ? searchTopicsItems : topicsItems;
  const opened = isSearch ? searchOpenedTopics : openedIDs;

  const canDrag = usePersistFunction(() => !isSearch && canReorder);
  const getDNDItemKey = useConst((item: TopicItem) => item.topicID);
  const getVirtualItemKey = useConst((index: number, data: TopicItem[]) => data[index].topicID);

  const sizes = React.useMemo(() => {
    const topicMap: Partial<Record<string, number>> = {};
    const nodeOffsetMap: Partial<Record<string, Partial<Record<string, number>>>> = {};
    const topicOffsetMap: Partial<Record<string, number>> = {};

    const getTopicItemSize = ({
      items,
      offset,
      isOpened,
      diagramID,
    }: {
      items: TopicMenuItem[];
      offset: number;
      isOpened: boolean;
      diagramID: string;
    }): number => {
      if (!isOpened) {
        items.forEach((item) => {
          if (item.type === BaseModels.Diagram.MenuItemType.NODE) {
            nodeOffsetMap[diagramID] ??= {};
            nodeOffsetMap[diagramID]![item.sourceID] = offset;
          }

          if (item.type === BaseModels.Diagram.MenuItemType.DIAGRAM) {
            topicOffsetMap[item.topicID] = offset;

            getTopicItemSize({ items: item.menuItems, offset, isOpened: false, diagramID: item.topicID });
          }
        });

        return 0;
      }

      return items.reduce((acc, item) => {
        if (item.type === BaseModels.Diagram.MenuItemType.NODE) {
          nodeOffsetMap[diagramID] ??= {};
          nodeOffsetMap[diagramID]![item.sourceID] = acc + offset;

          return acc + ITEM_HEIGHT;
        }

        if (item.type === BaseModels.Diagram.MenuItemType.DIAGRAM) {
          topicOffsetMap[item.topicID] = acc + offset;

          return (
            acc +
            getTopicItemSize({
              items: item.menuItems,
              offset: offset + acc + ITEM_HEIGHT,
              isOpened: opened[item.topicID],
              diagramID: item.topicID,
            }) +
            ITEM_HEIGHT
          );
        }

        return acc;
      }, 0);
    };

    topics.reduce((acc, { topicID, menuItems }, index) => {
      const isOpened = opened[topicID];

      const topicHeight =
        getTopicItemSize({
          items: menuItems,
          offset: acc + ITEM_HEIGHT,
          isOpened,
          diagramID: topicID,
        }) + ITEM_HEIGHT;

      topicMap[topicID] = topicHeight + (index === topics.length - 1 ? BOTTOM_PADDING : 0);
      topicOffsetMap[topicID] = acc;

      return acc + topicHeight;
    }, 0);

    return { topicMap, nodeOffsetMap, topicOffsetMap };
  }, [topics, opened]);

  const getItemSize = React.useCallback(
    (index: number) => sizes.topicMap[topics[index]?.topicID] || ITEM_HEIGHT,
    [sizes.topicMap]
  );

  useDidUpdateEffect(() => {
    listRef.current?.resetAfterIndex(0);
  }, [opened, topics]);

  const scrollIntoView = (position: number | undefined) => {
    if (!scrollBarsRef.current || !listRef.current || position === undefined) return;

    const values = scrollBarsRef.current.getValues();
    const headerSize = HEADER_MIN_HEIGHT + SEARCH_INPUT_HEIGHT;

    if (position < values.scrollTop + headerSize) {
      listRef.current.scrollTo(position - headerSize);
    } else if (position + ITEM_HEIGHT > values.scrollTop + (values.clientHeight - headerSize)) {
      listRef.current.scrollTo(position + ITEM_HEIGHT - values.clientHeight + headerSize + ITEM_HEIGHT / 2);
    }
  };

  useDidUpdateEffect(() => {
    if (!activeDiagramID || !focusedNodeID) return;

    scrollIntoView(sizes.nodeOffsetMap[activeDiagramID]?.[focusedNodeID]);
  }, [focusedNodeID]);

  useDidUpdateEffect(() => {
    if (!activeDiagramID) return;

    scrollIntoView(sizes.topicOffsetMap[activeDiagramID]);
  }, [activeDiagramID]);

  useDidUpdateEffect(() => {
    if (!scrollToTopicID) return;

    scrollIntoView(sizes.topicOffsetMap[scrollToTopicID]);
  }, [scrollToTopicID]);

  return (
    <DraggableList
      type={DragItem.TOPICS}
      canDrag={canDrag}
      itemProps={{
        isSearch,
        onAddIntent,
        onToggleOpen: onToggleOpenedID,
        openedTopics: opened,
        focusedNodeID,
        rootDiagramID,
        activeDiagramID,
        onCreateSubtopic,
        searchMatchValue,
        onSubtopicDragEnd: onNestedDragEnd,
        lastCreatedDiagramID,
        onSubtopicDragStart: onNestedDragStart,
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
          itemSize={getItemSize}
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
                    <System.IconButton.Base icon="plus" size={System.IconButton.Size.M} onClick={onCreateTopic} />
                  </TippyTooltip>
                )
              }
            >
              <SearchInput
                value={searchValue}
                onChangeText={setSearchValue}
                placeholder="Search"
                $onIconClick={() => setSearchValue('')}
              />
            </Header>
          }
        />
      )}
    </DraggableList>
  );
};

export default TopicsSection;
