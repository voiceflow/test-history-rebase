import { CustomScrollbarsTypes, Link, SvgIcon, useConst, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import { XYCoord } from 'react-dnd';
import { List } from 'react-virtualized';

import DraggableList from '@/components/DraggableList';
import VirtualList from '@/components/VirtualList';
import * as Documentation from '@/config/documentation';
import { Permission } from '@/config/permissions';
import { DragItem } from '@/constants';
import { useDidUpdateEffect, usePermission } from '@/hooks';
import { withTargetValue } from '@/utils/dom';

import SearchInput, { SEARCH_INPUT_HEIGHT } from '../components/SearchInput';
import { HORIZONTAL_DRAG_OFFSET, ITEM_HEIGHT, SEARCHABLE_COMPONENTS_COUNT } from '../constants';
import Header, { HEADER_MIN_HEIGHT } from '../Header';
import FolderItem from './FolderItem';
import { ComponentItem, useComponents } from './hooks';
import * as S from './styles';

interface ComponentsSectionProps {
  collapsed?: boolean;
  setSectionHeight: (height: number) => void;
}

const ComponentsSection: React.FC<ComponentsSectionProps> = ({ collapsed, setSectionHeight }) => {
  const listRef = React.useRef<List>(null);
  const scrollBarsRef = React.useRef<CustomScrollbarsTypes.Scrollbars>(null);
  const [canReorder] = usePermission(Permission.REORDER_TOPICS_AND_COMPONENTS);

  const {
    onDragEnd,
    onDragStart,
    searchValue,
    setSearchValue,
    componentsItems,
    activeDiagramID,
    searchMatchValue,
    onReorderComponents,
    lastCreatedDiagramID,
    searchComponentsItems,
    onClearLastCreatedDiagramID,
  } = useComponents();

  const isSearch = !!searchMatchValue;

  const components = isSearch ? searchComponentsItems : componentsItems;

  const canDrag = usePersistFunction(() => !isSearch && canReorder);
  const horizontalEnabled = usePersistFunction(
    (_: ComponentItem, initialOffset: XYCoord, currentOffset: XYCoord) => currentOffset.x - initialOffset.x >= HORIZONTAL_DRAG_OFFSET
  );

  const getItemKey = useConst((item: ComponentItem) => item.id);

  const withSearch = !collapsed && (isSearch || components.length >= SEARCHABLE_COMPONENTS_COUNT);

  useDidUpdateEffect(() => {
    const index = components.findIndex(({ id }) => id === lastCreatedDiagramID);

    if (index !== -1) {
      const offset = Array.from({ length: index + 1 }).reduce<number>((acc) => acc + ITEM_HEIGHT, 0);

      scrollBarsRef.current?.scrollTop(offset + HEADER_MIN_HEIGHT + (withSearch ? SEARCH_INPUT_HEIGHT : 0));
    }
  }, [lastCreatedDiagramID]);

  return (
    <DraggableList
      type={DragItem.COMPONENTS}
      canDrag={canDrag}
      itemProps={{
        isSearch,
        activeDiagramID,
        searchMatchValue,
        lastCreatedDiagramID,
        onClearLastCreatedDiagramID,
      }}
      onReorder={onReorderComponents}
      onEndDrag={onDragEnd}
      getItemKey={getItemKey}
      onStartDrag={onDragStart}
      itemComponent={FolderItem}
      previewOptions={{ horizontalEnabled }}
      previewComponent={FolderItem}
      unmountableDuringDrag
      disableReorderingWhileDraggingX
    >
      {({ renderItem }) => (
        <VirtualList
          ref={scrollBarsRef}
          size={components.length}
          header={
            <Header
              label="Flows"
              collapsed={collapsed}
              rightAction={
                collapsed && (
                  <S.CollapseIconContainer onClick={() => setSectionHeight(372)}>
                    <SvgIcon icon="arrowRightTopics" size={9} color="#becedc" />
                  </S.CollapseIconContainer>
                )
              }
            >
              {withSearch ? <SearchInput value={searchValue} onChange={withTargetValue(setSearchValue)} placeholder="Search" /> : null}
            </Header>
          }
          listRef={listRef}
          listStyle={{ padding: '2px 0 8px 0' }}
          rowHeight={ITEM_HEIGHT}
          renderItem={(index) => {
            const item = components[index];

            return renderItem({
              key: item.id,
              item,
              index,
              isLast: index === components.length - 1,
              isFirst: index === 0,
              itemKey: item.id,
            });
          }}
          renderPlaceholder={({ width }) => (
            <S.Placeholder width={width}>
              To create a flow, select a collection of blocks and choose <b>‘Create flow’</b> icon in the toolbar.{' '}
              <Link href={Documentation.COMPONENTS_LAYER}>Learn more</Link>
            </S.Placeholder>
          )}
        />
      )}
    </DraggableList>
  );
};

export default ComponentsSection;
