import React from 'react';

import { styled } from '@/hocs';

const RegularText = styled.span`
  color: #5d9df5;
  display: inline-block;
  cursor: pointer;
  user-select: none;

  :hover {
    color: #4886da;
  }
`;

type ClickableTextProps = {
  onClick?: () => void;
  children: any;
  className?: any;
};

// eslint-disable-next-line react/display-name
const ClickableText: React.FC<ClickableTextProps> = ({ onClick, children, className }, ref) => {
  return (
    <RegularText onClick={onClick} className={className} ref={ref}>
      {children}
    </RegularText>
  );
};

export default React.forwardRef(ClickableText);
