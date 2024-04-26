import type { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import type { SvgIconTypes } from '@voiceflow/ui';
import { getNestedMenuFormattedLabel, OverflowText, OverflowTippyTooltip } from '@voiceflow/ui';
import React from 'react';

import type { DragPreviewComponentProps, ItemComponentProps } from '@/components/DraggableList';
import * as Router from '@/ducks/router';
import { useDispatch, useEventualEngine } from '@/hooks';

import SearchLabel from '../../../../SearchLabel';
import ItemNameIcon from '../../../ItemNameIcon';
import type { TopicMenuNodeItem } from '../../hooks';
import * as S from './styles';

interface NodeItemProps extends ItemComponentProps<TopicMenuNodeItem>, DragPreviewComponentProps {
  isSearch: boolean;
  diagramID: string;
  isSubtopic?: boolean;
  focusedNodeID: Nullable<string>;
  activeDiagramID: Nullable<string>;
  searchMatchValue: string;
}

const getIcon = (type: Realtime.BlockType): SvgIconTypes.Icon => {
  switch (type) {
    case Realtime.BlockType.START:
      return 'systemFlag';
    case Realtime.BlockType.INTENT:
      return 'intentSmall';
    default:
      return 'close';
  }
};

const getPlaceholder = (type: Realtime.BlockType): string => {
  switch (type) {
    case Realtime.BlockType.INTENT:
      return 'Select intent';
    case Realtime.BlockType.START:
      return 'Assistant starts here';
    default:
      return 'Select step';
  }
};

const NodeItem: React.ForwardRefRenderFunction<HTMLElement, NodeItemProps> = (
  { item, isSearch, diagramID, isDragging, isDraggingPreview, focusedNodeID, activeDiagramID, searchMatchValue },
  ref
) => {
  const getEngine = useEventualEngine();

  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush, diagramID, item.nodeID);

  const onClick = () => {
    const engine = getEngine();

    if (!engine) {
      return;
    }

    if (diagramID === activeDiagramID) {
      engine.focusNode(item.nodeID, { open: true });
    } else {
      goToDiagram();
    }
  };

  const isStart = item.nodeType === Realtime.BlockType.START;

  return (
    <OverflowTippyTooltip<HTMLElement> content={item.name}>
      {(tooltipRef) => (
        <S.Container
          ref={isStart ? undefined : (ref as React.Ref<HTMLDivElement>)}
          onClick={onClick}
          isActive={focusedNodeID === item.nodeID}
          isDragging={isDragging}
          isPlaceholder={!item.name}
          isDraggingPreview={isDraggingPreview}
        >
          <S.IconContainer>
            <ItemNameIcon icon={getIcon(item.nodeType)} />
          </S.IconContainer>

          <OverflowText ref={tooltipRef}>
            {isSearch ? (
              <SearchLabel>{getNestedMenuFormattedLabel(item.name, searchMatchValue)}</SearchLabel>
            ) : (
              item.name || getPlaceholder(item.nodeType)
            )}
          </OverflowText>
        </S.Container>
      )}
    </OverflowTippyTooltip>
  );
};

export default React.forwardRef<HTMLElement, NodeItemProps>(NodeItem);
