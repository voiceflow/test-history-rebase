import { Portal, portalRootNode, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import { DismissableLayerProvider, useDismissable } from 'react-dismissable-layers';
import { Manager, Popper as ReactPopper, PopperProps as ReactPopperProps, Reference } from 'react-popper';
import { MemoryRouter } from 'react-router-dom';

import { ClassName } from '@/styles/constants';

import { Body, Container } from './components';

export { Content as PopperContent, Footer as PopperFooter, Nav as PopperNav, NavItem as PopperNavItem } from './components';

interface RendererProps {
  onClose: () => void;
  isOpened: boolean;
  onToggle: () => void;
}

interface ChildrenProps extends RendererProps {
  ref: React.Ref<any>;
}

export interface PopperProps {
  width?: string;
  height?: string;
  opened?: boolean;
  onClose?: () => void;
  children: (props: ChildrenProps) => React.ReactNode;
  renderNav?: (props: RendererProps) => React.ReactNode;
  modifiers?: ReactPopperProps['modifiers'];
  placement?: ReactPopperProps['placement'];
  portalNode?: HTMLElement;
  initialTab?: string;
  renderFooter?: (props: RendererProps) => React.ReactNode;
  renderContent: (props: RendererProps) => React.ReactNode;
  preventOverflowPadding?: number;
}

const Popper: React.FC<PopperProps> = ({
  width,
  height,
  opened,
  onClose,
  children,
  renderNav,
  modifiers,
  placement = 'bottom',
  initialTab,
  portalNode = portalRootNode,
  renderFooter,
  renderContent,
  preventOverflowPadding = 16,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [isOpened, onToggle, onForceClose] = useDismissable(opened, { ref: containerRef, onClose });

  useDidUpdateEffect(() => {
    if ((opened && !isOpened) || (!opened && isOpened)) {
      onToggle();
    }
  }, [opened]);

  const rendererProps = { onClose: onForceClose, isOpened, onToggle };

  const Wrapper = renderNav ? MemoryRouter : React.Fragment;

  return (
    <Manager>
      <Reference>{({ ref }) => children({ ...rendererProps, ref })}</Reference>

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
                {({ ref, style }) => (
                  <div ref={ref} style={{ ...style, zIndex: 1000 }}>
                    <Container className={ClassName.POPPER} style={{ width, height }}>
                      {renderNav?.(rendererProps)}

                      <Body>
                        {renderContent(rendererProps)}

                        {renderFooter?.(rendererProps)}
                      </Body>
                    </Container>
                  </div>
                )}
              </ReactPopper>
            </Portal>
          </DismissableLayerProvider>
        </Wrapper>
      )}
    </Manager>
  );
};

export default Popper;
