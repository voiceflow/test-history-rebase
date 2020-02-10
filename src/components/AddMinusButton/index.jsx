import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { styled } from '@/hocs';

export const ButtonContainer = styled.div`
  border-radius: 50%;
  width: 17px;
  height: 17px;
  margin: 0 4px;
  padding: 3px;
  display: inline-block;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  transition: all 0.1s linear;
  opacity: 0.85;
  background-color: ${(props) => (props.disabled ? '#D4D9E6' : '#6E849A')};

  :hover {
    opacity: 1;
  }
`;

function AddMinusButton({ onClick, type = 'add', disabled, className }) {
  const icon = type === 'add' ? 'zoomIn' : 'zoomOut';
  return (
    <ButtonContainer onClick={onClick} disabled={disabled} className={className}>
      <SvgIcon color="#fff" icon={icon} size={11} />
    </ButtonContainer>
  );
}

export default AddMinusButton;
