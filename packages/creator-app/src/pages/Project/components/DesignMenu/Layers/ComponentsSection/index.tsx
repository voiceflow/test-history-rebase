import { CustomScrollbarsTypes, Link, SvgIcon, useConst, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import { XYCoord } from 'react-dnd';

import DraggableList from '@/components/DraggableList';
import VirtualList from '@/components/VirtualList';
import * as Documentation from '@/config/documentation';
import { DragItem } from '@/constants';
import { Permission } from '@/constants/permissions';
import { useDidUpdateEffect, usePermission } from '@/hooks';

import Header from '../../Header';
import { HEADER_MIN_HEIGHT, HORIZONTAL_DRAG_OFFSET, ITEM_HEIGHT } from '../constants';
import SearchInput, { SEARCH_INPUT_HEIGHT } from '../SearchInput';
import FolderItem from './FolderItem';
import { ComponentItem, useComponents } from './hooks';
import * as S from './styles';
import VirtualListItem from './VirtualListItem';

interface ComponentsSectionProps {
  collapsed?: boolean;
  setSectionHeight: (height: number) => void;
}

const ComponentsSection: React.OldFC<ComponentsSectionProps> = ({ collapsed, setSectionHeight }) => {
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

  const itemSize = useConst(() => ITEM_HEIGHT);
  const getDNDItemKey = useConst((item: ComponentItem) => item.id);
  const getVirtualItemKey = useConst((index: number, data: ComponentItem[]) => data[index].id);

  useDidUpdateEffect(() => {
    const index = components.findIndex(({ id }) => id === lastCreatedDiagramID);

    if (index !== -1) {
      const offset = Array.from({ length: index + 1 }).reduce<number>((acc) => acc + ITEM_HEIGHT, 0);

      scrollBarsRef.current?.scrollTop?.(offset + HEADER_MIN_HEIGHT + SEARCH_INPUT_HEIGHT);
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
      getItemKey={getDNDItemKey}
      canReorder={() => !isSearch && canReorder}
      onStartDrag={onDragStart}
      itemComponent={FolderItem}
      previewOptions={previewOptions}
      previewComponent={FolderItem}
      unmountableDuringDrag
      disableReorderingWhileDraggingX
    >
      {() => (
        <VirtualList<ComponentItem[]>
          size={components.length}
          itemKey={getVirtualItemKey}
          itemSize={itemSize}
          listData={components}
          scrollbarsRef={scrollBarsRef}
          itemComponent={VirtualListItem}
          estimatedItemSize={ITEM_HEIGHT}
          header={
            <Header
              label="Components"
              onClick={collapsed ? () => setSectionHeight(372) : undefined}
              collapsed={collapsed}
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
                <SearchInput value={searchValue} onChangeText={setSearchValue} placeholder="Search" $onIconClick={() => setSearchValue('')} />
              )}
            </Header>
          }
          renderPlaceholder={({ width }) => (
            <S.Placeholder width={width}>
              {!isSearch && (
                <>
                  <SvgIcon size={72} icon="componentOutline" />
                  Components are reusable collections of blocks that can be used anywhere. <br />
                  <Link href={Documentation.COMPONENTS_LAYER}>Learn more</Link>
                </>
              )}
            </S.Placeholder>
          )}
        />
      )}
    </DraggableList>
  );
};

export default ComponentsSection;
