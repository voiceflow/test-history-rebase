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

import Header from '../../Header';
import { HEADER_MIN_HEIGHT, HORIZONTAL_DRAG_OFFSET, ITEM_HEIGHT } from '../constants';
import SearchInput, { SEARCH_INPUT_HEIGHT } from '../SearchInput';
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

  const canDrag = usePersistFunction(() => canReorder);
  const horizontalEnabled = usePersistFunction(
    (_: ComponentItem, initialOffset: XYCoord, currentOffset: XYCoord) => currentOffset.x - initialOffset.x >= HORIZONTAL_DRAG_OFFSET
  );

  const getItemKey = useConst((item: ComponentItem) => item.id);

  useDidUpdateEffect(() => {
    const index = components.findIndex(({ id }) => id === lastCreatedDiagramID);

    if (index !== -1) {
      const offset = Array.from({ length: index + 1 }).reduce<number>((acc) => acc + ITEM_HEIGHT, 0);

      scrollBarsRef.current?.scrollTop(offset + HEADER_MIN_HEIGHT + SEARCH_INPUT_HEIGHT);
    }
  }, [lastCreatedDiagramID]);

  const previewOptions = React.useMemo(() => ({ horizontalEnabled }), [horizontalEnabled]);

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
      previewOptions={previewOptions}
      previewComponent={FolderItem}
      unmountableDuringDrag
      disableReorderingWhileDraggingX
      canReorder={() => !isSearch && canReorder}
    >
      {({ renderItem }) => (
        <VirtualList
          ref={scrollBarsRef}
          size={components.length}
          header={
            <Header
              label="Components"
              collapsed={collapsed}
              onClick={collapsed ? () => setSectionHeight(372) : undefined}
              paddingRight={22}
              rightAction={
                collapsed && (
                  <S.CollapseIconContainer>
                    <SvgIcon icon="arrowRightTopics" size={9} />
                  </S.CollapseIconContainer>
                )
              }
            >
              {(isSearch || !!components.length) && (
                <SearchInput value={searchValue} onChange={withTargetValue(setSearchValue)} placeholder="Search" />
              )}
            </Header>
          }
          listRef={listRef}
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
              <SvgIcon size={72} icon="componentOutline" />
              Components are reusable collections of blocks that can be used anywhere. <br />
              <Link href={Documentation.COMPONENTS_LAYER}>Learn more</Link>
            </S.Placeholder>
          )}
        />
      )}
    </DraggableList>
  );
};

export default ComponentsSection;
