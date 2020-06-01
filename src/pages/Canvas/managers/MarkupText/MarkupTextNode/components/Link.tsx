import React from 'react';

type LinkProps = {
  href: string;
};

const Link: React.FC<LinkProps> = ({ href, children }) => {
  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) {
        e.stopPropagation();
        e.preventDefault();
        window.open(href, '_blank', 'toolbar=0,location=0,menubar=0');
      }
    },
    [href]
  );

  return <span onMouseDown={onClick}>{children}</span>;
};

export default Link;
