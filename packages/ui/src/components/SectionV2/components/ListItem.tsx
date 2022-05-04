import { FlexCenter } from '@ui/components/Flex';
import IconButton, { IconButtonVariant } from '@ui/components/IconButton';
import SvgIcon, { Icon } from '@ui/components/SvgIcon';
import TippyTooltip from '@ui/components/TippyTooltip';
import React from 'react';

import ActionsContainer from './ActionsContainer';
import ListItemContainer from './ListItemContainer';
import ListItemContent from './ListItemContent';
import ListItemIconContainer from './ListItemIconContainer';

export interface ListItemProps {
  icon?: Icon;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  isActive?: boolean;
  contentRef?: React.Ref<HTMLDivElement>;
  actionIcon?: Icon;
  iconWarning?: string | null;
  onActionClick?: VoidFunction;
}

const ListItem: React.FC<ListItemProps> = ({ icon, onClick, isActive, children, contentRef, actionIcon, iconWarning, onActionClick }) => (
  <ListItemContainer>
    <ListItemContent ref={contentRef} onClick={onClick} isActive={isActive}>
      {(!!iconWarning || !!icon) && (
        <ListItemIconContainer>
          <FlexCenter style={{ height: '100%' }}>
            {iconWarning ? (
              <TippyTooltip title={iconWarning}>
                <SvgIcon icon="warning" color="#BF395B" />
              </TippyTooltip>
            ) : (
              icon && <SvgIcon icon={icon} color="#6e849a" />
            )}
          </FlexCenter>
        </ListItemIconContainer>
      )}

      {children}
    </ListItemContent>

    {!!actionIcon && !!onActionClick && (
      <ActionsContainer unit={0} offsetUnit={2}>
        <IconButton size={16} icon={actionIcon} variant={IconButtonVariant.BASIC} onClick={onActionClick} />
      </ActionsContainer>
    )}
  </ListItemContainer>
);

export default ListItem;
