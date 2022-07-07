import composeRef from '@seznam/compose-react-refs';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Portal, SvgIcon, SvgIconTypes, Text, TippyTooltip, usePopper } from '@voiceflow/ui';
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
import { TooltipContainer } from './TooltipText';

interface SubMenuButtonProps {
  type: BlockType;
  icon: SvgIconTypes.Icon | React.FC;
  label: string;
  onDrop: VoidFunction;
  tooltipText?: string;
  tooltipLink?: string;
  factoryData?: Partial<Realtime.NodeData<unknown>>;
  isDraggingPreview?: boolean;
}

const SubMenuButton: React.FC<SubMenuButtonProps> = ({ type, icon, label, onDrop, tooltipText, tooltipLink, factoryData, isDraggingPreview }) => {
  const getEngine = useEventualEngine();
  const isAutoPanning = React.useContext(AutoPanningCacheContext);
  const [isClickedState, enableClickedState, clearClickedState] = useEnableDisable();
  const [isHovered, , hoverHandlers] = useHover({ hoverDelay: 1600 });

  const [{ isDragging }, connectDrag, connectPreview] = useDrag<StepDragItem, unknown, { isDragging: boolean }>({
    item: { type: DragItem.BLOCK_MENU, icon, label, blockType: type, factoryData },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),

    begin: () => {
      getEngine()?.merge.setVirtualSource(type, factoryData);
      getEngine()?.drag.setDraggingToCreate(true);
    },

    end: () => {
      onDrop();
      isAutoPanning.current = false;

      getEngine()?.merge.reset();
      getEngine()?.drag.setDraggingToCreate(false);
    },
  });

  useSetup(() => {
    connectPreview(getEmptyImage(), { captureDraggingState: true });
  });

  const popper = usePopper({ strategy: 'fixed', placement: 'right-start' });

  useTeardown(() => connectDrag(null), [connectDrag]);

  React.useEffect(() => {
    if (isDragging) {
      clearClickedState();
    }
  }, [isDragging]);

  return (
    <SubMenuButtonContainer
      ref={composeRef<HTMLDivElement>(connectDrag, popper.setReferenceElement)}
      className={cn(ClassName.STEP_MENU_ITEM, `${ClassName.STEP_MENU_ITEM}--${type}`)}
      isClicked={isClickedState}
      onMouseUp={clearClickedState}
      isDragging={isDragging}
      onMouseDown={enableClickedState}
      isDraggingPreview={isDraggingPreview}
      {...hoverHandlers}
    >
      <Box.FlexStart width="100%" opacity={isDragging ? 0 : 1}>
        <SvgIcon icon={icon} size={16} />

        <Text pl={12} width="100%" fontSize="15px" lineHeight="21px">
          {label}
        </Text>
      </Box.FlexStart>

      {!isDragging && isHovered && tooltipText && (
        <Portal portalNode={document.body}>
          <div ref={popper.setPopperElement} style={{ ...popper.styles.popper, paddingLeft: '6px' }} {...popper.attributes.popper}>
            <TooltipContainer>
              <TippyTooltip.FooterButton width={168} onClick={() => window.open(tooltipLink, '_blank')} buttonText="More" defaultVisible>
                {tooltipText}
              </TippyTooltip.FooterButton>
            </TooltipContainer>
          </div>
        </Portal>
      )}
    </SubMenuButtonContainer>
  );
};

export default React.memo(SubMenuButton);
