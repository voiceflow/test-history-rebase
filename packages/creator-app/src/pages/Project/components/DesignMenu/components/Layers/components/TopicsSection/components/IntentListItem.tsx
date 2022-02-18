import composeRefs from '@seznam/compose-react-refs';
import { Nullable } from '@voiceflow/common';
import { getNestedMenuFormattedLabel } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps } from '@/components/DraggableList';
import OverflowTippyTooltip from '@/components/OverflowTippyTooltip';
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

  const goToDiagram = useDispatch(Router.goToDiagramHistoryClear, diagramID, stepID);

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
    <OverflowTippyTooltip title={intent?.name}>
      {(tooltipRef) => (
        <IntentContainer
          ref={composeRefs(ref, tooltipRef)}
          onClick={onClick}
          isActive={focusedNodeID === stepID}
          isDragging={isDragging}
          isPlaceholder={!intent}
          isDraggingPreview={isDraggingPreview}
        >
          {isSearch ? <SearchLabel>{getNestedMenuFormattedLabel(intent?.name, searchMatchValue)}</SearchLabel> : intent?.name ?? 'Empty intent step'}
        </IntentContainer>
      )}
    </OverflowTippyTooltip>
  );
};

export default React.forwardRef<HTMLElement, IntentListItemProps>(IntentListItem as any);
