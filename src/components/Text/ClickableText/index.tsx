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

type ClickableTextProps = {
  path?: string;
  link?: string;
  onClick?: () => void;
  children: any;
  className?: any;
};

const ClickableText: React.FC<ClickableTextProps> = ({ path, link, onClick, children, className }) => {
  if (path) {
    return (
      <Link onClick={onClick} to={path} className={className}>
        {children}
      </Link>
    );
  }
  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <RegularText onClick={onClick} className={className}>
      {children}
    </RegularText>
  );
};

export default ClickableText;
