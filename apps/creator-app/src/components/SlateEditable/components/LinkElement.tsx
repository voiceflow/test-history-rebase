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
      const withoutExtraKeys = !(event.metaKey || event.ctrlKey || event.shiftKey);

      if (withoutExtraKeys) {
        event.stopPropagation();
        event.preventDefault();
      }

      if (href && withoutExtraKeys) {
        openURLInANewTab(href);
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
