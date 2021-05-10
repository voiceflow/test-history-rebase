import React from 'react';
import { RenderElementProps } from 'slate-react';

import { styled } from '@/hocs';

const ClickableLink = styled.span`
  display: inline;
  cursor: pointer;
  pointer-events: all;

  &:hover {
    opacity: 0.8;
  }
`;

const LinkElement: React.FC<RenderElementProps> = ({ attributes, children, element }) => {
  const href = element.url as string;

  const onClick = React.useCallback(
    (event: React.MouseEvent) => {
      const withoutExtraKeys = !(event.metaKey || event.ctrlKey || event.shiftKey);

      if (withoutExtraKeys) {
        event.stopPropagation();
        event.preventDefault();
      }

      if (withoutExtraKeys) {
        // not using http/https here since the links can have custom protocols, like zpl://
        const link = href.startsWith('//') || href.includes('://') ? href : `//${href}`;

        window.open(link, '_blank', 'toolbar=0,location=0,menubar=0');
      }
    },
    [href]
  );

  return (
    <ClickableLink {...attributes} style={{ position: 'relative' }} onMouseDown={onClick}>
      {children}
    </ClickableLink>
  );
};

export default LinkElement;
