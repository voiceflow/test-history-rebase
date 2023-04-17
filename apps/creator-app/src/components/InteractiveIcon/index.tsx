import { SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';
import { withProps } from 'recompose';

import { styled } from '@/hocs/styled';

interface InteractiveIconProps {
  icon: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  message?: string;
  disabled?: boolean;
  className?: string;
}

export const ButtonContainer = styled.div<{ disabled?: boolean }>`
  border-radius: 50%;
  width: 17px;
  height: 17px;
  margin: 0 4px;
  padding: 3px;
  display: block;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  transition: all 0.1s linear;
  opacity: 0.85;
  background-color: ${({ disabled }) => (disabled ? '#D4D9E6' : '#6E849A')};

  :hover {
    opacity: 1;
  }
`;

const InteractiveIcon: React.FC<InteractiveIconProps> = ({ onClick, icon, disabled, className, message }) => (
  <ButtonContainer onClick={onClick} disabled={disabled} className={className}>
    <TippyTooltip content={message}>
      <SvgIcon color="#fff" icon={icon as any} size={11} />
    </TippyTooltip>
  </ButtonContainer>
);

export const Add = withProps({ icon: 'plus' })(InteractiveIcon);
export const Minus = withProps({ icon: 'zoomOut' })(InteractiveIcon);

export default InteractiveIcon;
