import React, { useEffect, useState } from 'react';
import { RenderElementProps } from 'slate-react';
import styled from 'styled-components';

import { openURLInANewTab } from '@/utils/window';

import { LinkElement as LinkElementType } from '../editor/types';

const ClickableLink = styled.span<{ isCmdOrCtrlPressed: boolean }>`
  display: inline;
  pointer-events: all;
  cursor: ${(props) => (props.isCmdOrCtrlPressed ? 'pointer' : 'text')};

  &:hover {
    opacity: ${(props) => (props.isCmdOrCtrlPressed ? '0.8' : '1')};
  }
`;

interface LinkElementProps extends Omit<RenderElementProps, 'element'> {
  element: LinkElementType;
  isClickable?: boolean;
}

const LinkElement: React.FC<LinkElementProps> = ({ attributes, children, element, isClickable }) => {
  const href = element.url;
  const [isCmdOrCtrlPressed, setIsCmdOrCtrlPressed] = useState(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey) {
      setIsCmdOrCtrlPressed(true);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey) {
      setIsCmdOrCtrlPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const onClick = (event: React.MouseEvent) => {
    if (isClickable || event.metaKey || event.ctrlKey) {
      if (href) {
        openURLInANewTab(href);
      }
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <ClickableLink {...attributes} isCmdOrCtrlPressed={isClickable || isCmdOrCtrlPressed} style={{ position: 'relative' }} onClick={onClick}>
      {children}
    </ClickableLink>
  );
};

export default LinkElement;
