import React from 'react';
import { Link } from 'react-router-dom';

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

function ClickableText({ link, onClick, children, className }) {
  if (link) {
    return (
      <Link onClick={onClick} to={link} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <RegularText onClick={onClick} className={className}>
      {children}
    </RegularText>
  );
}

export default ClickableText;
