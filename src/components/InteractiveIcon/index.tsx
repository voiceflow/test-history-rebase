import React from 'react';
import { Tooltip } from 'react-tippy';
import { withProps } from 'recompose';

import SvgIcon from '@/components/SvgIcon';
import { styled } from '@/hocs';

type InteractiveIconProps = {
  disabled?: boolean;
  onClick?: () => void;
  icon: string;
  className?: string;
  message?: string;
};

export const ButtonContainer = styled.div<{ disabled?: boolean }>`
  border-radius: 50%;
  width: 17px;
  height: 17px;
  margin: 0 4px;
  padding: 3px;
  display: inline-block;
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
    <Tooltip title={message}>
      <SvgIcon color="#fff" icon={icon as any} size={11} />
    </Tooltip>
  </ButtonContainer>
);

export const Add = withProps({ icon: 'zoomIn' })(InteractiveIcon);
export const Minus = withProps({ icon: 'zoomOut' })(InteractiveIcon);

export default InteractiveIcon;
