import React from 'react';

type AnchorProps = {
  link?: string;
};

const Anchor: React.FC<AnchorProps> = ({ link, children, ...props }) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
};

export default Anchor;
