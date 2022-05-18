import Portal, { portalRootNode } from '@ui/components/Portal';
import { useDidUpdateEffect, useTheme } from '@ui/hooks';
import { ClassName } from '@ui/styles/constants';
import React from 'react';
import { DismissableLayerProvider, DismissEventType, useDismissable } from 'react-dismissable-layers';
import { Manager, Popper as ReactPopper, PopperProps as ReactPopperProps, Reference } from 'react-popper';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { Body, Container, Content, Footer, Nav, NavItem } from './components';

interface RendererProps {
  onClose: VoidFunction;
  isOpened: boolean;
  onToggle: VoidFunction;
  scheduleUpdate: VoidFunction;
}

interface ChildrenProps extends Omit<RendererProps, 'scheduleUpdate'> {
  ref: React.Ref<any>;
}

export interface PopperProps {
  width?: string;
  height?: string;
  zIndex?: number;
  opened?: boolean;
  onClose?: VoidFunction;
  children?: (props: ChildrenProps) => React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
  renderNav?: (props: RendererProps) => React.ReactNode;
  modifiers?: ReactPopperProps['modifiers'];
  placement?: ReactPopperProps['placement'];
  portalNode?: HTMLElement;
  initialTab?: string;
  dismissEvent?: DismissEventType;
  renderFooter?: (props: RendererProps) => React.ReactNode;
  renderContent: (props: RendererProps) => React.ReactNode;
  disableLayers?: boolean;
  initialOpened?: boolean;
  preventOverflowPadding?: number;
  borderRadius?: string;
}

const Popper: React.FC<PopperProps> = ({
  width,
  height,
  opened,
  zIndex,
  onClose,
  children,
  maxWidth,
  maxHeight,
  renderNav,
  modifiers,
  placement = 'bottom',
  initialTab,
  portalNode = portalRootNode,
  dismissEvent,
  renderFooter,
  renderContent,
  disableLayers,
  initialOpened,
  preventOverflowPadding = 16,
  borderRadius = '5px',
}) => {
  const theme = useTheme();

  const containerRef = React.useRef<HTMLDivElement>(null);

  const [isOpened, onToggle, onForceClose] = useDismissable(opened ?? initialOpened, { ref: containerRef, onClose, dismissEvent, disableLayers });

  useDidUpdateEffect(() => {
    if ((opened && !isOpened) || (!opened && isOpened)) {
      onToggle();
    }
  }, [opened]);

  const rendererProps = { onClose: onForceClose, isOpened, onToggle };

  const Wrapper = renderNav ? MemoryRouter : React.Fragment;

  const nestedTheme = React.useMemo(() => ({ ...theme, zIndex: { ...theme.zIndex, popper: (zIndex ?? theme.zIndex.popper) + 1 } }), [theme, zIndex]);

  return (
    <Manager>
      {children && <Reference>{({ ref }) => children({ ...rendererProps, ref })}</Reference>}

      {isOpened && (
        <Wrapper
          {...(renderNav
            ? {
                initialIndex: initialTab ? 0 : undefined,
                initialEntries: initialTab ? [initialTab] : undefined,
              }
            : {})}
        >
          <DismissableLayerProvider>
            <ThemeProvider theme={nestedTheme}>
              <Portal portalNode={portalNode}>
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
                      <Container className={ClassName.POPPER} style={{ width, height, maxWidth, maxHeight, borderRadius }}>
                        {renderNav?.({ ...rendererProps, scheduleUpdate })}

                        <Body>
                          {renderContent({ ...rendererProps, scheduleUpdate })}

                          {renderFooter?.({ ...rendererProps, scheduleUpdate })}
                        </Body>
                      </Container>
                    </div>
                  )}
                </ReactPopper>
              </Portal>
            </ThemeProvider>
          </DismissableLayerProvider>
        </Wrapper>
      )}
    </Manager>
  );
};

export default Object.assign(Popper, { Nav, Footer, Content, NavItem });
