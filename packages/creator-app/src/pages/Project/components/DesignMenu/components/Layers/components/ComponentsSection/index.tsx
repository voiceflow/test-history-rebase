import * as Realtime from '@voiceflow/realtime-sdk';
import { Link, SvgIcon, useConst, usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import { XYCoord } from 'react-dnd';
import { List } from 'react-virtualized';

import { Scrollbars } from '@/components/CustomScrollbars';
import DraggableList from '@/components/DraggableList';
import VirtualList from '@/components/VirtualList';
import * as Documentation from '@/config/documentation';
import { BlockType, DragItem } from '@/constants';
import { useDidUpdateEffect, useEventualEngine } from '@/hooks';
import { getTargetValue } from '@/utils/dom';

import Header, { HEADER_MIN_HEIGHT } from '../Header';
import SearchInput, { SEARCH_INPUT_HEIGHT } from '../SearchInput';
import { CollapseIconContainer, COMPONENT_ITEM_HEIGHT, FolderItem, Placeholder } from './components';
import { ComponentItem, useComponents } from './hooks';

const LAST_TOPIC_OFFSET = 8;
const FIRST_TOPIC_OFFSET = 4;
const HORIZONTAL_DRAG_OFFSET = 30;
const SEARCHABLE_COMPONENTS_COUNT = 6;

interface ComponentsSectionProps {
  collapsed?: boolean;
  setSectionHeight: (height: number) => void;
}

const ComponentsSection: React.FC<ComponentsSectionProps> = ({ collapsed, setSectionHeight }) => {
  const getEngine = useEventualEngine();
  const listRef = React.useRef<List>(null);
  const scrollBarsRef = React.useRef<Scrollbars>(null);

  const {
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

  const rowHeight = React.useCallback(
    ({ index }: { index: number }) => {
      const topOffset = index === 0 ? FIRST_TOPIC_OFFSET : 0;
      const bottomOffset = index === components.length - 1 ? LAST_TOPIC_OFFSET : 0;

      return COMPONENT_ITEM_HEIGHT + topOffset + bottomOffset;
    },
    [components]
  );

  const canDrag = usePersistFunction(() => !isSearch);
  const horizontalEnabled = usePersistFunction(
    (_: ComponentItem, initialOffset: XYCoord, currentOffset: XYCoord) => currentOffset.x - initialOffset.x >= HORIZONTAL_DRAG_OFFSET
  );

  const onStartDrag = React.useCallback(
    (item: ComponentItem) => {
      const engine = getEngine();

      if (!engine || !item) {
        return;
      }

      engine.merge.setVirtualSource(BlockType.COMPONENT, {
        name: item.name,
        diagramID: item.id,
      } as Realtime.NodeData<any>);
    },
    [getEngine]
  );

  const onEndDrag = React.useCallback(() => {
    getEngine()?.merge.reset();
  }, [getEngine]);

  const getItemKey = useConst((item: ComponentItem) => item.id);

  const withSearch = !collapsed && (isSearch || components.length >= SEARCHABLE_COMPONENTS_COUNT);

  useDidUpdateEffect(() => {
    const index = components.findIndex(({ id }) => id === lastCreatedDiagramID);

    if (index !== -1) {
      const offset = Array.from({ length: index + 1 }).reduce<number>((acc, _, i) => acc + rowHeight({ index: i }), 0);

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
      onEndDrag={onEndDrag}
      getItemKey={getItemKey}
      onStartDrag={onStartDrag}
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
              label="Components"
              collapsed={collapsed}
              rightAction={
                collapsed && (
                  <CollapseIconContainer onClick={() => setSectionHeight(372)}>
                    <SvgIcon icon="arrowRightTopics" size={9} color="#becedc" />
                  </CollapseIconContainer>
                )
              }
            >
              {withSearch ? <SearchInput value={searchValue} onChange={getTargetValue(setSearchValue)} placeholder="Search" /> : null}
            </Header>
          }
          listRef={listRef}
          listStyle={{ padding: '2px 0 8px 0' }}
          rowHeight={rowHeight}
          renderItem={(index) => {
            const item = components[index];

            return renderItem({ key: item.id, itemKey: item.id, item, index });
          }}
          renderPlaceholder={({ width }) => (
            <Placeholder width={width}>
              To create a component, select a collection of blocks and choose <b>‘Create component’</b> icon in the toolbar.{' '}
              <Link href={Documentation.COMPONENTS_LAYER}>Learn more</Link>
            </Placeholder>
          )}
        />
      )}
    </DraggableList>
  );
};

export default ComponentsSection;
