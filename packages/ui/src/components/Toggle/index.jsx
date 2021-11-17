import { styled } from '@ui/styles';
import { stopPropagation } from '@ui/utils/dom';
import React from 'react';
import ReactToggle from 'react-toggle';

const SmallToggleContainer = styled.div`
  position: relative;
  height: 20px;
  margin-top: -2px;
  margin-right: -4px;
  margin-left: -4px;
  transform: scale(0.8);
`;

const Toggle = ({ small, ...props }, ref) => {
  const toggle = <ReactToggle {...props} ref={ref} onClick={stopPropagation()} icons={false} />;
  return small ? <SmallToggleContainer>{toggle}</SmallToggleContainer> : toggle;
};

export default React.forwardRef(Toggle);
