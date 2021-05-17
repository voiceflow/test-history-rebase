import React from 'react';
import { RenderElementProps } from 'slate-react';

import { styled } from '@/hocs';

import { LinkElement as LinkElementType } from '../../MarkupSlateEditor';

const ClickableLink = styled.span`
  display: inline;
  cursor: pointer;
  pointer-events: all;

  &:hover {
    opacity: 0.8;
  }
`;

interface LinkElementProps extends Omit<RenderElementProps, 'element'> {
  element: LinkElementType;
}

const LinkElement: React.FC<LinkElementProps> = ({ attributes, children, element }) => {
  const href = element.url;

  const onClick = React.useCallback(
    (event: React.MouseEvent) => {
      const withoutExtraKeys = !(event.metaKey || event.ctrlKey || event.shiftKey);

      if (withoutExtraKeys) {
        event.stopPropagation();
        event.preventDefault();
      }

      if (href && withoutExtraKeys) {
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
