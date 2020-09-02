import * as PopperJS from '@popperjs/core';
import React from 'react';

import Icon from '@/components/SvgIcon';
import TutorialTooltip from '@/components/TutorialTooltip';
import { css, styled, transition } from '@/hocs';

type IconContainerProps = { isOpen: boolean };

export const IconContainer = styled.div<IconContainerProps>`
  ${transition('color')}
  position: relative;
  cursor: pointer;
  display: inline-block;
  color: #becedc;
  top: 3px;

  ${({ isOpen }) =>
    isOpen &&
    css`
      color: #5d9df5 !important;
    `}
  :hover {
    color: #8da2b5;
  }
`;

export type InfoIconProps = {
  placement?: PopperJS.Placement;
  tooltipProps?: any;
};

const InfoIcon: React.FC<InfoIconProps> = ({ children, placement = 'bottom-start', tooltipProps }) => {
  return (
    <TutorialTooltip
      {...tooltipProps}
      placement={placement}
      portalNode={document.body}
      anchorRenderer={({ isOpen }: { isOpen: boolean }) => (
        <IconContainer isOpen={isOpen}>
          <Icon size={16} icon="info" />
        </IconContainer>
      )}
    >
      {children}
    </TutorialTooltip>
  );
};

export default InfoIcon;
