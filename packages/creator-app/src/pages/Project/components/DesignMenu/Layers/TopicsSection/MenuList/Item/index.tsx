import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { getNestedMenuFormattedLabel, OverflowTippyTooltip, SvgIcon, SvgIconTypes } from '@voiceflow/ui';
import React from 'react';

import { DragPreviewComponentProps, ItemComponentProps } from '@/components/DraggableList';
import * as Router from '@/ducks/router';
import { useDispatch, useEventualEngine } from '@/hooks';

import SearchLabel from '../../../../SearchLabel';
import { TopicMenuItem } from '../../hooks';
import * as S from './styles';

interface IntentListItemProps extends ItemComponentProps<TopicMenuItem>, DragPreviewComponentProps {
  isSearch: boolean;
  diagramID: string;
  focusedNodeID: Nullable<string>;
  isActiveDiagram: boolean;
  searchMatchValue: string;
}

const getIcon = (type: Realtime.BlockType): SvgIconTypes.Icon => {
  switch (type) {
    case Realtime.BlockType.START:
      return 'systemFlag';
    case Realtime.BlockType.INTENT:
      return 'intentSmall';
    case Realtime.BlockType.COMPONENT:
      return 'systemSymbolSmall';
    default:
      return 'close';
  }
};

const getPlaceholder = (type: Realtime.BlockType): string => {
  switch (type) {
    case Realtime.BlockType.INTENT:
      return 'Select intent';
    case Realtime.BlockType.COMPONENT:
      return 'Select component';
    case Realtime.BlockType.START:
      return 'Project starts here';
    default:
      return 'Select step';
  }
};

const IntentListItem: React.ForwardRefRenderFunction<HTMLDivElement, IntentListItemProps> = (
  { item, isSearch, diagramID, isDragging, isDraggingPreview, focusedNodeID, isActiveDiagram, searchMatchValue },
  ref
) => {
  const getEngine = useEventualEngine();

  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush, diagramID, item.nodeID);

  const onClick = () => {
    const engine = getEngine();

    if (!engine) {
      return;
    }

    if (isActiveDiagram) {
      engine.focusNode(item.nodeID, { open: true });
    } else {
      goToDiagram();
    }
  };

  // eslint-disable-next-line xss/no-mixed-html
  return (
    <OverflowTippyTooltip<HTMLDivElement> content={item.name}>
      {(tooltipRef) => (
        <S.IntentContainer
          ref={ref}
          onClick={onClick}
          isActive={focusedNodeID === item.nodeID}
          isDragging={isDragging}
          isPlaceholder={!item.name}
          isDraggingPreview={isDraggingPreview}
        >
          <S.IconContainer>
            <SvgIcon icon={getIcon(item.type)} />
          </S.IconContainer>

          <S.IntentContent ref={tooltipRef}>
            {isSearch ? (
              <SearchLabel>{getNestedMenuFormattedLabel(item.name, searchMatchValue)}</SearchLabel>
            ) : (
              item.name || getPlaceholder(item.type)
            )}
          </S.IntentContent>
        </S.IntentContainer>
      )}
    </OverflowTippyTooltip>
  );
};

export default React.forwardRef<HTMLElement, IntentListItemProps>(IntentListItem as any);
