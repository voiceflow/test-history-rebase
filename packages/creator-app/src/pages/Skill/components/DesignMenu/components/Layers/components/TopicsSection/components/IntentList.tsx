import { useConst, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import DraggableList from '@/components/DraggableList';
import { DragItem } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import { useDispatch } from '@/hooks';
import { Nullable } from '@/types';
import { reorder } from '@/utils/array';

import { TopicIntentItem } from '../hooks';
import IntentContainer from './IntentContainer';
import IntentListContainer from './IntentListContainer';
import IntentListItem from './IntentListItem';
import StartIntent from './StartIntent';

interface IntentListProps {
  isRoot: boolean;
  isSearch: boolean;
  isActive: boolean;
  diagramID: string;
  intentItems: TopicIntentItem[];
  focusedNodeID: Nullable<string>;
  searchMatchValue: string;
}

const IntentList: React.FC<IntentListProps> = ({ isRoot, isSearch, isActive, diagramID, intentItems, focusedNodeID, searchMatchValue }) => {
  const updateIntenSteps = useDispatch(Diagram.updateIntentSteps, diagramID);

  const getItemKey = useConst((item: TopicIntentItem) => item.id);
  const canDrag = usePersistFunction(() => !isSearch);

  const onReorderIntentSteps = React.useCallback(
    (from: number, to: number) =>
      updateIntenSteps(
        reorder(
          intentItems.map((item) => item.id),
          from,
          to
        )
      ),
    [diagramID, intentItems]
  );

  return (
    <IntentListContainer>
      {!isRoot && !intentItems.length && (
        <IntentContainer disabled isPlaceholder>
          Add Intent Step
        </IntentContainer>
      )}

      {!isSearch && isRoot && <StartIntent diagramID={diagramID} isActive={isActive} focusedNodeID={focusedNodeID} />}

      {!!intentItems.length && (
        <DraggableList
          type={`${DragItem.TOPIC_INTENTS}${diagramID}`}
          items={intentItems}
          canDrag={canDrag}
          itemProps={{ diagramID, focusedNodeID, isActiveDiagram: isActive, isSearch, searchMatchValue }}
          onReorder={onReorderIntentSteps}
          getItemKey={getItemKey}
          itemComponent={IntentListItem}
          previewComponent={IntentListItem}
        />
      )}
    </IntentListContainer>
  );
};

export default React.memo(IntentList);
