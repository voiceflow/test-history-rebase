import Portal, { portalRootNode } from '@ui/components/Portal';
import { useDidUpdateEffect, useNestedPopperTheme, usePersistFunction, useTheme } from '@ui/hooks';
import { ThemeProvider } from '@ui/styles';
import { ClassName } from '@ui/styles/constants';
import React from 'react';
import { DismissableLayerProvider, useDismissable } from 'react-dismissable-layers';
import { Manager, Popper as ReactPopper, Reference } from 'react-popper';
import { MemoryRouter } from 'react-router-dom';

import { baseStyles, Body, Container, Content, Footer, Nav, NavItem } from './components';
import * as T from './types';

export * as PopperTypes from './types';

const Popper: React.FC<T.Props> = ({
  width,
  height,
  inline,
  opened,
  zIndex,
  onOpen,
  onClose,
  children,
  maxWidth,
  maxHeight,
  renderNav,
  modifiers,
  placement = 'bottom',
  initialTab,
  portalNode = portalRootNode,
  preventClose,
  dismissEvent,
  renderFooter,
  renderContent,
  disableLayers,
  initialOpened,
  preventOverflowPadding = 16,
}) => {
  const theme = useTheme();
  const nestedTheme = useNestedPopperTheme(zIndex);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const [isOpened, onToggle, onForceClose] = useDismissable(opened ?? initialOpened, {
    ref: containerRef,
    onClose,
    dismissEvent,
    disableLayers,
    preventClose,
  });

  const handleToggle = usePersistFunction(() => {
    onToggle();
    if (!isOpened && onOpen) onOpen();
  });

  useDidUpdateEffect(() => {
    if (opened !== isOpened) onToggle();
  }, [opened]);

  const rendererProps = { onClose: onForceClose, isOpened, onToggle: handleToggle };

  const Wrapper = renderNav ? MemoryRouter : React.Fragment;

  const popper = isOpened && (
    <Wrapper
      {...(renderNav
        ? {
            initialIndex: initialTab ? 0 : undefined,
            initialEntries: initialTab ? [initialTab] : undefined,
          }
        : {})}
    >
      <Portal portalNode={portalNode}>
        <DismissableLayerProvider>
          <ThemeProvider theme={nestedTheme}>
            <ReactPopper
              innerRef={containerRef}
              placement={placement}
              modifiers={{
                offset: { offset: '0,5' },
                preventOverflow: { boundariesElement: portalNode, padding: preventOverflowPadding },
                ...modifiers,
              }}
              positionFixed
            >
              {({ ref, style, scheduleUpdate }) => (
                <div ref={ref} style={{ ...style, zIndex: zIndex ?? theme.zIndex.popper }}>
                  <Container className={ClassName.POPPER} width={width} height={height} maxWidth={maxWidth} maxHeight={maxHeight}>
                    {renderNav?.({ ...rendererProps, scheduleUpdate })}

                    <Body>
                      {renderContent({ ...rendererProps, scheduleUpdate })}

                      {renderFooter?.({ ...rendererProps, scheduleUpdate })}
                    </Body>
                  </Container>
                </div>
              )}
            </ReactPopper>
          </ThemeProvider>
        </DismissableLayerProvider>
      </Portal>
    </Wrapper>
  );

  return (
    <Manager>
      {children && <Reference>{({ ref }) => children({ ...rendererProps, ref, popper: inline && popper })}</Reference>}

      {!inline && popper}
    </Manager>
  );
};

export default Object.assign(Popper, {
  baseStyles,

  Nav,
  Footer,
  Content,
  NavItem,
});
