import React from 'react';
import { RenderElementProps } from 'slate-react';

import { styled } from '@/hocs/styled';
import { openURLInANewTab } from '@/utils/window';

import { LinkElement as LinkElementType } from '../editor/types';

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
      // Open the link only if the meta (Cmd on Mac) or Ctrl key is pressed
      if (event.metaKey || event.ctrlKey) {
        if (href) {
          openURLInANewTab(href);
        }
      } else {
        // Prevent the default link behavior when Cmd/Ctrl is not pressed
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [href]
  );

  return (
    <ClickableLink {...attributes} style={{ position: 'relative' }} onClick={onClick}>
      {children}
    </ClickableLink>
  );
};

export default LinkElement;
