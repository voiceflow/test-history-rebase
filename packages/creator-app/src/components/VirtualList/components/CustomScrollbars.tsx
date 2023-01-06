import composeRef from '@seznam/compose-react-refs';
import { CustomScrollbars as UICustomScrollbars, CustomScrollbarsTypes, setRef } from '@voiceflow/ui';
import React from 'react';

import { ScrollContextProvider } from '@/contexts/ScrollContext';
import { useScrollHelpers } from '@/hooks/scroll';

import { useScrollBarContext } from '../context';
import WindowScrollerContainer from './WindowScrollerContainer';

const CustomScrollbars = React.forwardRef<HTMLDivElement, CustomScrollbarsTypes.Props>(({ style, children, ...props }, ref) => {
  const { bodyRef, scrollHelpers } = useScrollHelpers<CustomScrollbarsTypes.Scrollbars>();
  const { ref: scrollbarsRef, header, renderPlaceholder, size } = useScrollBarContext();

  const refSetter = React.useCallback((scrollbars: CustomScrollbarsTypes.Scrollbars | null) => {
    setRef(ref, scrollbars?.view ?? null);
  }, []);

  return (
    <UICustomScrollbars
      {...props}
      ref={composeRef<CustomScrollbarsTypes.Scrollbars>(scrollbarsRef, bodyRef, refSetter)}
      style={{ ...style, overflow: 'hidden' }}
    >
      <ScrollContextProvider value={scrollHelpers}>
        {header}
        {size === 0 && renderPlaceholder ? (
          renderPlaceholder({ width: style?.width, height: style?.height })
        ) : (
          <WindowScrollerContainer>{children}</WindowScrollerContainer>
        )}
      </ScrollContextProvider>
    </UICustomScrollbars>
  );
});

export default CustomScrollbars;
