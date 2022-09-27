import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { useConst, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { BaseItemData } from '@/components/DraggableList';
import { DragItem } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import { useDispatch, useDnDReorder } from '@/hooks';

import { TopicMenuItem } from '../hooks';
import IntentListItem from './Item';
import { IntentContainer, IntentContent } from './Item/styles';
import * as S from './styles';

interface IntentListProps {
  isRoot: boolean;
  isSearch: boolean;
  isActive: boolean;
  diagramID: string;
  menuItems: TopicMenuItem[];
  focusedNodeID: Nullable<string>;
  searchMatchValue: string;
}

const IntentList: React.FC<IntentListProps> = ({ isRoot, isSearch, isActive, diagramID, menuItems, focusedNodeID, searchMatchValue }) => {
  const reorderMenuNode = useDispatch(Diagram.reorderMenuNode);

  const getItemKey = useConst((item: TopicMenuItem) => item.nodeID);

  const dndReorder = useDnDReorder({
    getID: getItemKey,
    onPersist: (nodeID: string, toIndex: number) => reorderMenuNode({ diagramID, nodeID, toIndex }),
    onReorder: (nodeID: string, toIndex: number) => reorderMenuNode({ diagramID, nodeID, toIndex, skipPersist: true }),
  });

  const canDrag = usePersistFunction((item: BaseItemData<TopicMenuItem>) => !isSearch && item.item.type !== Realtime.BlockType.START);

  return (
    <S.Container>
      {!isRoot && !menuItems.length && (
        <IntentContainer disabled isPlaceholder>
          <IntentContent>Add trigger intent step</IntentContent>
        </IntentContainer>
      )}

      {!!menuItems.length && (
        <DraggableList
          type={`${DragItem.TOPIC_INTENTS}${diagramID}`}
          items={menuItems}
          canDrag={canDrag}
          itemProps={{ diagramID, focusedNodeID, isActiveDiagram: isActive, isSearch, searchMatchValue }}
          onEndDrag={dndReorder.onEnd}
          onReorder={dndReorder.onReorder}
          onStartDrag={dndReorder.onStart}
          getItemKey={getItemKey}
          itemComponent={IntentListItem}
          previewComponent={IntentListItem}
        />
      )}
    </S.Container>
  );
};

export default React.memo(IntentList);
