import composeRef from '@seznam/compose-react-refs';
import * as Realtime from '@voiceflow/realtime-sdk';
import {
  Box,
  ContextMenu,
  OptionsMenuOption,
  Portal,
  SvgIcon,
  SvgIconTypes,
  TippyTooltip,
  useEnableDisable,
  usePopper,
} from '@voiceflow/ui';
import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { BlockType, DragItem } from '@/constants';
import { useEventualEngine } from '@/hooks/engine';
import { useHover } from '@/hooks/hover';
import { usePaymentModal } from '@/hooks/modal.hook';
import { StepDragItem } from '@/pages/Canvas/components/CanvasDiagram';
import { AutoPanningCacheContext } from '@/pages/Project/contexts/AutoPanningContext';
import { ClassName } from '@/styles/constants';
import { openInternalURLInANewTab } from '@/utils/window';

import ClickNoDragTooltip from '../../ClickNoDragTooltip';
import DefaultColorPopper from '../DefaultColorPopper';
import { StyledText, TooltipContainer } from '../styles';
import * as S from './styles';

interface SubMenuButtonProps {
  type: BlockType;
  icon: SvgIconTypes.Icon | React.FC;
  label?: string;
  onDrop: VoidFunction;
  isFocused?: boolean;
  tooltipText?: string;
  tooltipLink?: string;
  factoryData?: Partial<Realtime.NodeData<unknown>>;
  isDraggingPreview?: boolean;
}

const SubMenuButton: React.FC<SubMenuButtonProps> = ({
  type,
  icon,
  label,
  onDrop,
  isFocused,
  tooltipText,
  tooltipLink,
  factoryData,
  isDraggingPreview,
}) => {
  const getEngine = useEventualEngine();
  const paymentModal = usePaymentModal();

  const isAutoPanning = React.useContext(AutoPanningCacheContext);

  const [isClicked, enableClicked, clearClicked] = useEnableDisable();

  const [isHovered, , hoverHandlers] = useHover({ hoverDelay: 1600 });
  const [showPopper, , popperHoverHandlers] = useHover();

  const popper = usePopper({ strategy: 'fixed', placement: 'right-start' });

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

  const containerRef = composeRef<HTMLDivElement>(connectDrag, popper.setReferenceElement);

  const button = (isOpen?: boolean, onContextMenu?: React.MouseEventHandler) => (
    <ClickNoDragTooltip>
      {({ isOpen: isClickNoDragTooltipOpen }) => (
        <S.SubMenuButtonContainer
          {...hoverHandlers}
          ref={containerRef}
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
            <SvgIcon icon={icon} size={16} color="#132144" />

            <StyledText>{label}</StyledText>
          </Box.FlexStart>

          {!isClickNoDragTooltipOpen && !isDragging && isHovered && tooltipText && (
            <Portal portalNode={document.body}>
              <div
                ref={popper.setPopperElement}
                style={{ ...popper.styles.popper, paddingLeft: '6px' }}
                {...popper.attributes.popper}
              >
                <TooltipContainer width={tooltipLink ? 232 : 200}>
                  {tooltipLink ? (
                    <TippyTooltip.FooterButton
                      onClick={() => (tooltipLink ? openInternalURLInANewTab(tooltipLink) : paymentModal.openVoid({}))}
                      buttonText="Learn More"
                    >
                      {tooltipText}
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
    return (
      <ContextMenu options={menuOptions}>{({ isOpen, onContextMenu }) => button(isOpen, onContextMenu)}</ContextMenu>
    );
  }

  return button();
};

export default React.memo(SubMenuButton);
