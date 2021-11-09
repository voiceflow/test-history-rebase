import { Nullable } from '@voiceflow/common';
import { getNestedMenuFormattedLabel } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps } from '@/components/DraggableList';
import * as Router from '@/ducks/router';
import { useDispatch, useEventualEngine } from '@/hooks';

import SearchLabel from '../../SearchLabel';
import { TopicIntentItem } from '../hooks';
import IntentContainer from './IntentContainer';

interface IntentListItemProps extends ItemComponentProps<TopicIntentItem>, DragPreviewComponentProps {
  isSearch: boolean;
  diagramID: string;
  focusedNodeID: Nullable<string>;
  isActiveDiagram: boolean;
  searchMatchValue: string;
}

const IntentListItem: React.ForwardRefRenderFunction<HTMLDivElement, IntentListItemProps> = (
  { item: { id: stepID, intent }, isSearch, diagramID, isDragging, isDraggingPreview, focusedNodeID, isActiveDiagram, searchMatchValue },
  ref
) => {
  const getEngine = useEventualEngine();

  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush, diagramID, stepID);

  const onClick = () => {
    const engine = getEngine();

    if (!engine) {
      return;
    }

    if (isActiveDiagram) {
      engine.focusNode(stepID, { open: true });
    } else {
      goToDiagram();
    }
  };

  return (
    <IntentContainer
      ref={ref}
      onClick={onClick}
      isActive={focusedNodeID === stepID}
      isDragging={isDragging}
      isPlaceholder={!intent}
      isDraggingPreview={isDraggingPreview}
    >
      {isSearch ? <SearchLabel>{getNestedMenuFormattedLabel(intent?.name, searchMatchValue)}</SearchLabel> : intent?.name ?? 'Empty intent step'}
    </IntentContainer>
  );
};

export default React.forwardRef<HTMLElement, IntentListItemProps>(IntentListItem as any);
