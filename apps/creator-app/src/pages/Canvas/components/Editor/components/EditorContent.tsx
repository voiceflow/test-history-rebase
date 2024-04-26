import _isFunction from 'lodash/isFunction';
import React from 'react';

import ContentContainer from './EditorContentContainer';
import Footer from './EditorFooter';

export interface RenderOptions {
  scrollTo: (...args: [ScrollToOptions] | [number, number]) => void;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
}

export type EditorContentProps = React.ComponentProps<typeof ContentContainer> & {
  footer?: React.ReactNode | ((options: RenderOptions) => React.ReactNode);
  children?: React.ReactNode | ((options: RenderOptions) => React.ReactNode);
  hideFooter?: boolean;
};

const isScrollToArgs = (args: [ScrollToOptions] | [number, number]): args is [ScrollToOptions] =>
  typeof args[0] === 'object';

const EditorContent: React.FC<EditorContentProps> = ({
  footer,
  children,
  hideFooter,
  fillHeight = false,
  ...props
}) => {
  const containerRef = React.useRef<HTMLDivElement>();

  const scrollTo = React.useCallback(
    (...args: [ScrollToOptions] | [number, number]) =>
      isScrollToArgs(args) ? containerRef.current?.scrollTo(args[0]) : containerRef.current?.scrollTo(...args),
    []
  );
  const scrollToBottom = React.useCallback(
    (behavior: ScrollBehavior = 'smooth') => scrollTo({ top: containerRef.current?.scrollHeight, behavior }),
    [scrollTo]
  );

  return (
    <>
      <ContentContainer ref={containerRef} fillHeight={fillHeight} {...props}>
        {_isFunction(children) ? children({ scrollTo, scrollToBottom }) : children}
      </ContentContainer>

      {!hideFooter && <Footer>{_isFunction(footer) ? footer({ scrollTo, scrollToBottom }) : footer}</Footer>}
    </>
  );
};

export default EditorContent;
