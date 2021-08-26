import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import TutorialTooltip, { TutorialTooltipProps } from '@/components/TutorialTooltip';
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
  placement?: TutorialTooltipProps['placement'];
  tooltipProps?: Omit<TutorialTooltipProps, 'placement' | 'portalNode' | 'anchorRenderer'>;
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
