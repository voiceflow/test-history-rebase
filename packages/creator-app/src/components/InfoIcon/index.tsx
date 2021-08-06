import { SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { PopperProps } from 'react-popper';

import TutorialTooltip from '@/components/TutorialTooltip';
import { css, styled, transition } from '@/hocs';

interface IconContainerProps {
  isOpen: boolean;
}

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

export interface InfoIconProps {
  placement?: PopperProps['placement'];
  tooltipProps?: any;
}

const InfoIcon: React.FC<InfoIconProps> = ({ children, placement = 'bottom-start', tooltipProps }) => (
  <TutorialTooltip
    {...tooltipProps}
    placement={placement}
    portalNode={document.body}
    anchorRenderer={({ isOpen }: { isOpen: boolean }) => (
      <IconContainer isOpen={isOpen}>
        <SvgIcon size={16} icon="info" />
      </IconContainer>
    )}
  >
    {children}
  </TutorialTooltip>
);

export default InfoIcon;
