import composeRef from '@seznam/compose-react-refs';
import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Portal, SvgIcon, SvgIconTypes, TippyTooltip, usePopper } from '@voiceflow/ui';
import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { getLockedStepTooltipText, isLockedStep, lockedStepTooltipButtonText, lockedStepTypes } from '@/config/planLimits/steps';
import { BlockType, DragItem, ModalType } from '@/constants';
import { AutoPanningCacheContext } from '@/contexts';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useEnableDisable, useEventualEngine, useHover, useModals, useSelector, useSetup, useTeardown } from '@/hooks';
import { ClassName } from '@/styles/constants';

import { StepDragItem } from '../../../../DesignMenu/components/Steps/types';
import { StyledText, TooltipContainer } from '../styles';
import { SubMenuButtonContainer } from './SubMenuButtonContainer';

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

  const plan = useSelector(WorkspaceV2.active.planSelector);
  const isLocked = isLockedStep(plan, type);
  const { open: openPaymentModal } = useModals<{ planType: PlanType }>(ModalType.PAYMENT);

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

  const containerRef = isLocked ? popper.setReferenceElement : composeRef<HTMLDivElement>(connectDrag, popper.setReferenceElement);

  return (
    <SubMenuButtonContainer
      ref={containerRef}
      isClicked={isClickedState}
      onMouseUp={clearClickedState}
      onMouseDown={enableClickedState}
      isDragging={isDragging}
      isDraggingPreview={isDraggingPreview}
      className={ClassName.SUB_STEP_MENU_ITEM}
      disabled={isLocked as boolean}
      {...hoverHandlers}
    >
      <Box.FlexStart width="100%" opacity={isDragging ? 0 : 1}>
        <SvgIcon icon={icon} size={16} color={isLocked ? '#62778c' : '#132144'} />

        <StyledText disabled={isLocked as boolean}>{label}</StyledText>
      </Box.FlexStart>

      {!isDragging && isHovered && tooltipText && (
        <Portal portalNode={document.body}>
          <div ref={popper.setPopperElement} style={{ ...popper.styles.popper, paddingLeft: '6px' }} {...popper.attributes.popper}>
            <TooltipContainer>
              {tooltipLink ? (
                <TippyTooltip.FooterButton
                  width={isLocked ? 200 : 168}
                  onClick={isLocked ? openPaymentModal : () => window.open(tooltipLink, '_blank')}
                  buttonText={isLocked ? lockedStepTooltipButtonText : 'Learn More'}
                  defaultVisible
                >
                  {isLocked ? getLockedStepTooltipText(type as lockedStepTypes) : tooltipText}
                </TippyTooltip.FooterButton>
              ) : (
                <TippyTooltip.Multiline width={168}>{tooltipText}</TippyTooltip.Multiline>
              )}
            </TooltipContainer>
          </div>
        </Portal>
      )}
    </SubMenuButtonContainer>
  );
};

export default React.memo(SubMenuButton);
