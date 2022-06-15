import SvgIcon, { SvgIconTypes } from '@ui/components/SvgIcon';
import { OverflowText } from '@ui/components/Text';
import TippyTooltip from '@ui/components/TippyTooltip';
import React from 'react';

import ListItemActionsContainer from './ListItemActionsContainer';
import ListItemContainer from './ListItemContainer';
import ListItemContent from './ListItemContent';
import ListItemIconContainer from './ListItemIconContainer';

export interface ListItemProps {
  icon?: SvgIconTypes.Icon;
  action?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  isActive?: boolean;
  contentRef?: React.Ref<HTMLDivElement>;
  isDragging?: boolean;
  iconWarning?: string | null;
  actionCentred?: boolean;
  onContextMenu?: React.MouseEventHandler;
  isDraggingPreview?: boolean;
}

const ListItem = React.forwardRef<HTMLDivElement, React.PropsWithChildren<ListItemProps>>(
  ({ icon, action, onClick, isActive, children, contentRef, isDragging, iconWarning, actionCentred, onContextMenu, isDraggingPreview }, ref) => (
    <ListItemContainer ref={ref} isDragging={isDragging} isDraggingPreview={isDraggingPreview}>
      <ListItemContent ref={contentRef} onClick={onClick} isActive={isActive} onContextMenu={onContextMenu}>
        {(!!iconWarning || !!icon) && (
          <ListItemIconContainer>
            {iconWarning ? (
              <TippyTooltip title={iconWarning}>
                <SvgIcon icon="warning" color="#BF395B" />
              </TippyTooltip>
            ) : (
              icon && <SvgIcon icon={icon} color="#6e849a" />
            )}
          </ListItemIconContainer>
        )}
        {typeof children === 'string' ? <OverflowText>{children}</OverflowText> : children}
      </ListItemContent>

      {!!action && <ListItemActionsContainer isCentred={actionCentred}>{action}</ListItemActionsContainer>}
    </ListItemContainer>
  )
);

export default ListItem;
