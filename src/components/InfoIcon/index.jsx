import React from 'react';

import Icon from '@/components/SvgIcon';
import TutorialTooltip from '@/components/TutorialTooltip';
import { css, styled, transition } from '@/hocs';

export const IconContainer = styled.div`
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

function InfoIcon({ children, placement = 'bottom-start', tooltipProps }) {
  return (
    <TutorialTooltip
      {...tooltipProps}
      placement={placement}
      portalNode={document.body}
      anchorRenderer={({ isOpen }) => (
        <IconContainer isOpen={isOpen}>
          <Icon size={16} icon="info" />
        </IconContainer>
      )}
    >
      {children}
    </TutorialTooltip>
  );
}

export default InfoIcon;
