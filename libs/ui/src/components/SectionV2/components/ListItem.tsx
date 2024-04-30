import React from 'react';

import type { SvgIconTypes } from '@/components/SvgIcon';
import SvgIcon from '@/components/SvgIcon';
import { OverflowText } from '@/components/Text';
import type { TippyTooltipProps } from '@/components/TippyTooltip';
import TippyTooltip from '@/components/TippyTooltip';

import ListItemActionsContainer from './ListItemActionsContainer';
import ListItemContainer from './ListItemContainer';
import ListItemContent from './ListItemContent';
import ListItemIconContainer from './ListItemIconContainer';

export interface ListItemProps {
  icon?: SvgIconTypes.Icon;
  action?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  isActive?: boolean;
  iconProps?: Omit<SvgIconTypes.Props, 'icon'> | null;
  contentRef?: React.Ref<HTMLDivElement>;
  isDragging?: boolean;
  iconTooltip?: TippyTooltipProps | null;
  actionCentred?: boolean;
  onContextMenu?: React.MouseEventHandler;
  overflowHidden?: boolean;
  isDraggingPreview?: boolean;
}

const ListItem = React.forwardRef<HTMLDivElement, React.PropsWithChildren<ListItemProps>>(
  (
    {
      icon,
      action,
      onClick,
      isActive,
      children,
      iconProps,
      contentRef,
      isDragging,
      iconTooltip,
      actionCentred,
      onContextMenu,
      overflowHidden,
      isDraggingPreview,
    },
    ref
  ) => (
    <ListItemContainer ref={ref} isDragging={isDragging} isDraggingPreview={isDraggingPreview}>
      <ListItemContent
        ref={contentRef}
        onClick={onClick}
        isActive={isActive}
        onContextMenu={onContextMenu}
        overflowHidden={overflowHidden}
      >
        {!!icon && (
          <ListItemIconContainer>
            {iconTooltip ? (
              <TippyTooltip {...iconTooltip}>
                <SvgIcon icon={icon} {...iconProps} color={iconProps?.color ?? '#6e849a'} />
              </TippyTooltip>
            ) : (
              <SvgIcon icon={icon} {...iconProps} color={iconProps?.color ?? '#6e849a'} />
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
