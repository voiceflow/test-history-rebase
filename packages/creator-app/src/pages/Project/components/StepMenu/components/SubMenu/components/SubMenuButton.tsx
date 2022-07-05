import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Portal, SvgIcon, SvgIconTypes, Text, usePopper } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { BlockType, DragItem } from '@/constants';
import { AutoPanningCacheContext } from '@/contexts';
import { useEnableDisable, useEventualEngine, useHover, useSetup, useTeardown } from '@/hooks';
import { ClassName } from '@/styles/constants';

import { StepDragItem } from '../../../../DesignMenu/components/Steps/types';
import { SubMenuButtonContainer } from './SubMenuButtonContainer';
import { TooltipButton, TooltipContainer, TooltipText } from './TooltipText';

interface SubMenuButtonProps {
  type: BlockType;
  icon: SvgIconTypes.Icon | React.FC;
  label: string;
  tooltipText?: string;
  tooltipLink?: string;
  factoryData?: Partial<Realtime.NodeData<unknown>>;
  isDraggingPreview?: boolean;
}

const SubMenuButton: React.FC<SubMenuButtonProps> = ({ type, icon, label, tooltipText, tooltipLink, factoryData, isDraggingPreview }) => {
  const engine = useEventualEngine();
  const isAutoPanning = React.useContext(AutoPanningCacheContext);
  const [isClickedState, enableClickedState, clearClickedState] = useEnableDisable();
  const [isHovered, , hoverHandlers] = useHover();

  const [{ isDragging }, connectDrag, connectPreview] = useDrag<StepDragItem, unknown, { isDragging: boolean }>({
    item: { type: DragItem.BLOCK_MENU, icon, label, blockType: type, factoryData },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    begin: () => {
      engine()?.merge.setVirtualSource(type, factoryData);
      engine()?.drag.setDraggingToCreate(true);
    },
    end: () => {
      isAutoPanning.current = false;
      engine()?.merge.reset();
      engine()?.drag.setDraggingToCreate(false);
    },
  });

  useSetup(() => {
    connectPreview(getEmptyImage(), { captureDraggingState: true });
  });

  const popper = usePopper({
    placement: 'right-start',
    modifiers: [{ name: 'offset', options: { offset: [-15, 0] } }],
    strategy: 'fixed',
  });

  useTeardown(() => connectDrag(null), [connectDrag]);

  React.useEffect(() => {
    if (isDragging) {
      clearClickedState();
    }
  }, [isDragging]);

  return (
    <SubMenuButtonContainer
      isDragging={isDragging}
      isDraggingPreview={isDraggingPreview}
      className={cn(ClassName.STEP_MENU_ITEM, `${ClassName.STEP_MENU_ITEM}--${type}`)}
      isClicked={isClickedState}
      onMouseUp={clearClickedState}
      onMouseDown={enableClickedState}
      ref={connectDrag}
      {...hoverHandlers}
    >
      {!isDragging && (
        <Box.FlexStart width="100%" ref={popper.setReferenceElement}>
          <SvgIcon icon={icon} size={16} />
          <Text pl={12} fontSize="15px" width="100%">
            {label}
          </Text>
        </Box.FlexStart>
      )}
      {!isDragging && isHovered && tooltipText && (
        <Portal portalNode={document.body}>
          <div ref={popper.setPopperElement} style={popper.styles.popper} {...popper.attributes.popper}>
            <TooltipContainer>
              <TooltipText>{tooltipText}</TooltipText>
              <TooltipButton onClick={() => window.open(tooltipLink, '_blank')}>More</TooltipButton>
            </TooltipContainer>
          </div>
        </Portal>
      )}
    </SubMenuButtonContainer>
  );
};

export default React.memo(SubMenuButton);
