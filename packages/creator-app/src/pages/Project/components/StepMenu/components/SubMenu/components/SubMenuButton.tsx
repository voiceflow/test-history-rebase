import composeRef from '@seznam/compose-react-refs';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, ContextMenu, OptionsMenuOption, Portal, SvgIcon, SvgIconTypes, TippyTooltip, useLocalStorage, usePopper } from '@voiceflow/ui';
import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { addStepGuide } from '@/assets';
import { getLockedStepTooltipText, isLockedStep, lockedStepTooltipButtonText, lockedStepTypes } from '@/config/planLimits/steps';
import { BlockType, DragItem, ModalType } from '@/constants';
import { AutoPanningCacheContext } from '@/contexts';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useEnableDisable, useEventualEngine, useHover, useModals, useSelector, useSetup, useTeardown } from '@/hooks';
import { StepDragItem } from '@/pages/Canvas/components/CanvasDiagram';
import { ClassName } from '@/styles/constants';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

import DefaultColorPopper from '../DefaultColorPopper';
import { StyledText, TooltipContainer } from '../styles';
import { SubMenuButtonContainer } from './SubMenuButtonContainer';

const NO_DRAG_CLICKS_KEY = 'SubMenuButton:NO_DRAG_CLICKS';

interface SubMenuButtonProps {
  type: BlockType;
  icon: SvgIconTypes.Icon | React.FC;
  label: string;
  onDrop: VoidFunction;
  tooltipText?: string;
  tooltipLink?: string;
  factoryData?: Partial<Realtime.NodeData<unknown>>;
  isDraggingPreview?: boolean;
  isFocused?: boolean;
}

const SubMenuButton: React.FC<SubMenuButtonProps> = ({
  type,
  icon,
  label,
  onDrop,
  tooltipText,
  tooltipLink,
  factoryData,
  isDraggingPreview,
  isFocused,
}) => {
  const getEngine = useEventualEngine();
  const isAutoPanning = React.useContext(AutoPanningCacheContext);
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const isLocked = isLockedStep(plan, type);
  const [showPopper, , popperHoverHandlers] = useHover();
  const [isHovered, , hoverHandlers] = useHover({ hoverDelay: isLocked ? 0 : 1600 });

  const menuOptions = React.useMemo(
    () =>
      [
        {
          label: <DefaultColorPopper blockType={type} isHovered={showPopper} />,
          active: showPopper,
          ...popperHoverHandlers,
        },
      ] as OptionsMenuOption[],
    [showPopper]
  );

  const [isClickedState, enableClickedState, clearClickedState] = useEnableDisable();

  const { open: openPaymentModal } = useModals(ModalType.PAYMENT);

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
    if (isDragging) clearClickedState();
  }, [isDragging]);

  React.useEffect(() => {
    if (!isFocused) clearClickedState();
  }, [isFocused]);

  const buttonRef = React.useRef<HTMLDivElement>(null);
  const containerRef = isLocked ? popper.setReferenceElement : composeRef<HTMLDivElement>(connectDrag, popper.setReferenceElement, buttonRef);

  // number of times the user has clicked on the step without dragging
  // initialize to 5 so the user is over the threshold on first click
  const [getNoDragClicks, setNoDragClicks] = useLocalStorage(NO_DRAG_CLICKS_KEY, 5);
  const [showDragTip, setShowDragTip] = React.useState(false);

  const onMouseUp: React.MouseEventHandler<HTMLDivElement> = React.useCallback((event) => {
    // if the user clicked on the button without dragging, increment the number of clicks
    if (buttonRef.current?.contains(event.target as Node)) {
      setNoDragClicks(getNoDragClicks() + 1);

      if (getNoDragClicks() > 4) {
        setShowDragTip(true);
      }
    }
    clearClickedState();
  }, []);

  const confirmDragTip = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    setShowDragTip(false);
    setNoDragClicks(0);
    hoverHandlers.onMouseLeave(event);
  }, []);

  const onMouseLeave = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    setShowDragTip(false);
    hoverHandlers.onMouseLeave(event);
  }, []);

  const button = (isOpen?: boolean, onContextMenu?: React.MouseEventHandler) => (
    <SubMenuButtonContainer
      ref={containerRef}
      isClicked={isClickedState}
      onMouseUp={onMouseUp}
      onMouseDown={enableClickedState}
      isDragging={isDragging}
      isDraggingPreview={isDraggingPreview}
      isContextMenuOpen={isOpen && isFocused}
      className={ClassName.SUB_STEP_MENU_ITEM}
      disabled={isLocked as boolean}
      onContextMenu={onContextMenu}
      {...hoverHandlers}
      onMouseLeave={onMouseLeave}
    >
      <Box.FlexStart width="100%" opacity={isDragging ? 0 : 1}>
        <SvgIcon icon={icon} size={16} color={isLocked ? '#62778c' : '#132144'} />

        <StyledText disabled={isLocked as boolean}>{label}</StyledText>
      </Box.FlexStart>

      {showDragTip && (
        <Portal portalNode={document.body}>
          <div ref={popper.setPopperElement} style={{ ...popper.styles.popper, paddingLeft: '6px' }} {...popper.attributes.popper}>
            <TooltipContainer>
              <TippyTooltip.FooterButton buttonText="Don't show again" onClick={confirmDragTip}>
                Click + drag to add steps to the canvas.
                <Box borderRadius={6} mt={8} as="img" src={addStepGuide} alt="add step" width="100%" />
              </TippyTooltip.FooterButton>
            </TooltipContainer>
          </div>
        </Portal>
      )}

      {!showDragTip && !isDragging && isHovered && tooltipText && (
        <Portal portalNode={document.body}>
          <div ref={popper.setPopperElement} style={{ ...popper.styles.popper, paddingLeft: '6px' }} {...popper.attributes.popper}>
            <TooltipContainer>
              {tooltipLink ? (
                <TippyTooltip.FooterButton
                  onClick={isLocked ? () => openPaymentModal() : onOpenInternalURLInANewTabFactory(tooltipLink)}
                  buttonText={isLocked ? lockedStepTooltipButtonText : 'Learn More'}
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

  if (isFocused) {
    return <ContextMenu options={menuOptions}>{({ isOpen, onContextMenu }) => button(isOpen, onContextMenu)}</ContextMenu>;
  }

  return button();
};

export default React.memo(SubMenuButton);
