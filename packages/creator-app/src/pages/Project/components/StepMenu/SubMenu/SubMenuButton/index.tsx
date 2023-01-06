import composeRef from '@seznam/compose-react-refs';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, ContextMenu, OptionsMenuOption, Portal, SvgIcon, SvgIconTypes, TippyTooltip, useEnableDisable, usePopper } from '@voiceflow/ui';
import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { getLockedStepTooltipText, isLockedStep, lockedStepTooltipButtonText, LockedStepTypes } from '@/config/planLimits/steps';
import { BlockType, DragItem, ModalType } from '@/constants';
import { AutoPanningCacheContext } from '@/contexts/AutoPanningContext';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useEventualEngine, useHover, useModals, useSelector } from '@/hooks';
import { StepDragItem } from '@/pages/Canvas/components/CanvasDiagram';
import { ClassName } from '@/styles/constants';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

import ClickNoDragTooltip from '../../ClickNoDragTooltip';
import DefaultColorPopper from '../DefaultColorPopper';
import { StyledText, TooltipContainer } from '../styles';
import * as S from './styles';

interface SubMenuButtonProps {
  type: BlockType;
  icon: SvgIconTypes.Icon | React.OldFC;
  label?: string;
  onDrop: VoidFunction;
  tooltipText?: string;
  tooltipLink?: string;
  factoryData?: Partial<Realtime.NodeData<unknown>>;
  isDraggingPreview?: boolean;
  isFocused?: boolean;
}

const SubMenuButton: React.OldFC<SubMenuButtonProps> = ({
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
  const popper = usePopper({ strategy: 'fixed', placement: 'right-start' });
  const getEngine = useEventualEngine();
  const isAutoPanning = React.useContext(AutoPanningCacheContext);
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const isLocked = isLockedStep(plan, type);
  const [isClicked, enableClicked, clearClicked] = useEnableDisable();
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

  const { open: openPaymentModal } = useModals(ModalType.PAYMENT);

  const [{ isDragging }, connectDrag, connectPreview] = useDrag<StepDragItem, unknown, { isDragging: boolean }>({
    type: DragItem.BLOCK_MENU,

    item: () => {
      getEngine()?.merge.setVirtualSource(type, factoryData);
      getEngine()?.drag.setDraggingToCreate(true);

      return { type: DragItem.BLOCK_MENU, icon, label: label ?? '', blockType: type, factoryData };
    },

    collect: (monitor) => ({ isDragging: monitor.isDragging() }),

    end: () => {
      onDrop();
      isAutoPanning.current = false;

      getEngine()?.merge.reset();
      getEngine()?.drag.setDraggingToCreate(false);
    },
  });

  React.useEffect(() => {
    connectPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const containerRef = isLocked ? popper.setReferenceElement : composeRef<HTMLDivElement>(connectDrag, popper.setReferenceElement);

  const button = (isOpen?: boolean, onContextMenu?: React.MouseEventHandler) => (
    <ClickNoDragTooltip>
      {({ isOpen: isClickNoDragTooltipOpen }) => (
        <S.SubMenuButtonContainer
          {...hoverHandlers}
          ref={containerRef}
          disabled={!!isLocked}
          className={ClassName.SUB_STEP_MENU_ITEM}
          isClicked={isClicked}
          onMouseUp={clearClicked}
          isDragging={isDragging}
          onMouseDown={enableClicked}
          onContextMenu={onContextMenu}
          isDraggingPreview={isDraggingPreview}
          isContextMenuOpen={isOpen && isFocused}
        >
          <Box.FlexStart width="100%" opacity={isDragging ? 0 : 1}>
            <SvgIcon icon={icon} size={16} color={isLocked ? '#62778c' : '#132144'} />

            <StyledText disabled={isLocked as boolean}>{label}</StyledText>
          </Box.FlexStart>

          {!isClickNoDragTooltipOpen && !isDragging && isHovered && tooltipText && (
            <Portal portalNode={document.body}>
              <div ref={popper.setPopperElement} style={{ ...popper.styles.popper, paddingLeft: '6px' }} {...popper.attributes.popper}>
                <TooltipContainer width={tooltipLink ? 232 : 200}>
                  {tooltipLink ? (
                    <TippyTooltip.FooterButton
                      onClick={isLocked ? () => openPaymentModal() : onOpenInternalURLInANewTabFactory(tooltipLink)}
                      buttonText={isLocked ? lockedStepTooltipButtonText : 'Learn More'}
                    >
                      {isLocked ? getLockedStepTooltipText(type as LockedStepTypes) : tooltipText}
                    </TippyTooltip.FooterButton>
                  ) : (
                    <TippyTooltip.Multiline>{tooltipText}</TippyTooltip.Multiline>
                  )}
                </TooltipContainer>
              </div>
            </Portal>
          )}
        </S.SubMenuButtonContainer>
      )}
    </ClickNoDragTooltip>
  );

  if (isFocused) {
    return <ContextMenu options={menuOptions}>{({ isOpen, onContextMenu }) => button(isOpen, onContextMenu)}</ContextMenu>;
  }

  return button();
};

export default React.memo(SubMenuButton);
