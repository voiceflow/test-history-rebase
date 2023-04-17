import { BaseModels } from '@voiceflow/base-types';
import { Nullable, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { OverflowText, useConst, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { BaseItemData } from '@/components/DraggableList';
import { DragItem } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import { useDispatch, useDnDReorder } from '@/hooks';

import { TopicMenuItem } from '../hooks';
import type TopicItem from '../TopicItem';
import MenuItem from './MenuItem';
import { Container } from './NodeItem/styles';
import * as S from './styles';

interface MenuListProps {
  isRoot: boolean;
  isSearch: boolean;
  diagramID: string;
  menuItems: TopicMenuItem[];
  TopicItem: typeof TopicItem;
  isSubtopic?: boolean;
  onAddIntent: (topicID: string) => void;
  onToggleOpen: (topicID: string) => void;
  openedTopics: Record<string, boolean>;
  disableHover?: boolean;
  rootDiagramID: Nullable<string>;
  focusedNodeID: Nullable<string>;
  activeDiagramID: Nullable<string>;
  searchMatchValue: string;
  onCreateSubtopic: (rootTopicID: string) => void;
  onSubtopicDragEnd: VoidFunction;
  lastCreatedDiagramID: Nullable<string>;
  onSubtopicDragStart: (idsToClose: string[]) => void;
  onClearLastCreatedDiagramID: VoidFunction;
}

const MenuList: React.FC<MenuListProps> = ({ isRoot, isSearch, diagramID, isSubtopic, menuItems, ...props }) => {
  const removeMenuItem = useDispatch(Diagram.reorderMenuItem);

  const getItemKey = useConst((item: TopicMenuItem) => item.sourceID);

  const dndReorder = useDnDReorder({
    getID: getItemKey,
    onPersist: (sourceID: string, toIndex: number) => removeMenuItem({ diagramID, sourceID, toIndex }),
    onReorder: (sourceID: string, toIndex: number) => removeMenuItem({ diagramID, sourceID, toIndex, skipPersist: true }),
  });

  const canDrag = usePersistFunction(
    (item: BaseItemData<TopicMenuItem>) =>
      !isSearch && (item.item.type !== BaseModels.Diagram.MenuItemType.NODE || item.item.nodeType !== Realtime.BlockType.START)
  );

  const onDragStart = usePersistFunction((item: TopicMenuItem) => {
    dndReorder.onStart(item);

    props.onSubtopicDragStart(
      menuItems.map((item) => (item.type === BaseModels.Diagram.MenuItemType.DIAGRAM ? item.sourceID : null)).filter(Utils.array.isNotNullish)
    );
  });

  const onDragEnd = usePersistFunction(() => {
    dndReorder.onEnd();
    props.onSubtopicDragEnd();
  });

  return (
    <S.Container isSubtopic={isSubtopic}>
      {!isRoot && !menuItems.length && (
        <Container disabled isPlaceholder>
          <OverflowText>No intent steps exist</OverflowText>
        </Container>
      )}

      {!!menuItems.length && (
        <DraggableList
          type={`${DragItem.TOPIC_MENU_ITEMS}${diagramID}`}
          items={menuItems}
          canDrag={canDrag}
          itemProps={{ ...props, isSubtopic, diagramID, isSearch }}
          onEndDrag={onDragEnd}
          onReorder={dndReorder.onReorder}
          getItemKey={getItemKey}
          onStartDrag={onDragStart}
          itemComponent={MenuItem}
          previewComponent={MenuItem}
        />
      )}
    </S.Container>
  );
};

export default React.memo(MenuList);
