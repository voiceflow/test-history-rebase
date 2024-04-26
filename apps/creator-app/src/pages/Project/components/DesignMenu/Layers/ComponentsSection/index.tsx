import type { CustomScrollbarsTypes } from '@voiceflow/ui';
import { Link, SvgIcon, useConst, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import type { XYCoord } from 'react-dnd';
import type { VariableSizeList } from 'react-window';

import DraggableList from '@/components/DraggableList';
import VirtualList from '@/components/VirtualList';
import * as Documentation from '@/config/documentation';
import { DragItem } from '@/constants';
import { Permission } from '@/constants/permissions';
import { useDidUpdateEffect, usePermission } from '@/hooks';

import Header from '../../Header';
import {
  BOTTOM_PADDING,
  HEADER_MIN_HEIGHT,
  HORIZONTAL_DRAG_OFFSET,
  ITEM_HEIGHT,
  SEARCH_INPUT_HEIGHT,
} from '../constants';
import SearchInput from '../SearchInput';
import FolderItem from './FolderItem';
import type { ComponentItem } from './hooks';
import { useComponents } from './hooks';
import * as S from './styles';
import VirtualListItem from './VirtualListItem';

interface ComponentsSectionProps {
  collapsed?: boolean;
  setSectionHeight: (height: number) => void;
}

const ComponentsSection: React.FC<ComponentsSectionProps> = ({ collapsed, setSectionHeight }) => {
  const listRef = React.useRef<VariableSizeList<ComponentItem[]>>(null);
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
    lastCreatedDiagramID,
    searchComponentsItems,
    onClearLastCreatedDiagramID,
  } = useComponents();
  const isSearch = !!searchMatchValue;

  const components = isSearch ? searchComponentsItems : componentsItems;

  const canDrag = usePersistFunction(() => canReorder);
  const horizontalEnabled = usePersistFunction(
    (_: ComponentItem, initialOffset: XYCoord, currentOffset: XYCoord) =>
      currentOffset.x - initialOffset.x >= HORIZONTAL_DRAG_OFFSET
  );

  const itemSize = React.useCallback(
    (index: number) => ITEM_HEIGHT + (components.length - 1 === index ? BOTTOM_PADDING : 0),
    [components.length]
  );
  const getDNDItemKey = useConst((item: ComponentItem) => item.id);
  const getVirtualItemKey = useConst((index: number, data: ComponentItem[]) => data[index].id);

  useDidUpdateEffect(() => {
    listRef.current?.resetAfterIndex(Math.max(components.length - 2, 0));
  }, [components.length]);

  useDidUpdateEffect(() => {
    if (!activeDiagramID || !listRef.current || !scrollBarsRef.current) return;
    const index = components.findIndex(({ id }) => id === activeDiagramID);

    if (index === -1) return;

    const position = Array.from({ length: index + 1 }).reduce<number>((acc) => acc + ITEM_HEIGHT, 0);

    const values = scrollBarsRef.current.getValues();

    const headerSize = HEADER_MIN_HEIGHT + SEARCH_INPUT_HEIGHT;

    if (position < values.scrollTop + headerSize) {
      listRef.current.scrollTo(position - headerSize);
    } else if (position + ITEM_HEIGHT > values.scrollTop + (values.clientHeight - headerSize)) {
      listRef.current.scrollTo(position + ITEM_HEIGHT - values.clientHeight + headerSize + ITEM_HEIGHT / 2);
    }
  }, [activeDiagramID]);

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
      onEndDrag={onDragEnd}
      getItemKey={getDNDItemKey}
      canReorder={() => !isSearch}
      onStartDrag={onDragStart}
      itemComponent={FolderItem}
      previewOptions={previewOptions}
      previewComponent={FolderItem}
      unmountableDuringDrag
      disableReorderingWhileDraggingX
    >
      {() => (
        <VirtualList<ComponentItem[]>
          ref={listRef}
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
                <SearchInput
                  value={searchValue}
                  onChangeText={setSearchValue}
                  placeholder="Search"
                  $onIconClick={() => setSearchValue('')}
                />
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
