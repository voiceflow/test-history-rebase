import _isFunction from 'lodash/isFunction';
import React from 'react';

import { css, styled } from '@/hocs';

import { dividerStyles } from '../styles';
import Footer from './EditorFooter';

const EditorContentContainer = styled.div`
  ${dividerStyles}
  ${({ fillHeight }) =>
    fillHeight &&
    css`
      flex: 1;
    `}
  overflow-x: hidden;
  overflow-y: auto;
  border-top: none !important;

  /* Firefox scrollbar fix */
  scrollbar-width: none;

  /* chrome scrollbar fix */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const EditorContent = ({ footer, children, hideFooter, fillHeight = false, ...props }) => {
  const containerRef = React.useRef();

  const scrollTo = React.useCallback((...args) => containerRef.current.scrollTo(...args), []);
  const scrollToBottom = React.useCallback((behavior = 'smooth') => scrollTo({ top: containerRef.current.scrollHeight, behavior }), [scrollTo]);

  return (
    <>
      <EditorContentContainer ref={containerRef} fillHeight={fillHeight} {...props}>
        {_isFunction(children) ? children({ scrollTo, scrollToBottom }) : children}
      </EditorContentContainer>
      {!hideFooter && <Footer>{_isFunction(footer) ? footer({ scrollTo, scrollToBottom }) : footer}</Footer>}
    </>
  );
};

export default EditorContent;
