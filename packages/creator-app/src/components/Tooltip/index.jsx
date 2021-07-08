/* eslint-disable no-shadow */
import { Portal, portalRootNode, stopPropagation } from '@voiceflow/ui';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';
import { Manager, Popper, Reference } from 'react-popper';

import { FadeDownDelayedContainer, SlideContainer } from '@/styles/animations';

import { Container, JSONCode, Paragraph, Section, Title } from './components';

export { JSONCode, Paragraph, Section, Title };

export default function Tooltip({ anchorRenderer, placement = 'auto-end', children, portalNode }) {
  const [isOpen, onToggle] = useDismissable(false);

  return (
    <Manager>
      <Reference>{({ ref }) => anchorRenderer({ ref, isOpen, onToggle })}</Reference>
      {isOpen && (
        <Portal portalNode={portalNode}>
          <Popper modifiers={{ preventOverflow: { padding: 19, boundariesElement: portalRootNode } }} placement={placement}>
            {({ ref, style, placement }) => (
              <div ref={ref} style={{ ...style, zIndex: 1100 }} data-placement={placement}>
                <SlideContainer onClick={stopPropagation(null, true)}>
                  <Container>
                    <FadeDownDelayedContainer>{children}</FadeDownDelayedContainer>
                  </Container>
                </SlideContainer>
              </div>
            )}
          </Popper>
        </Portal>
      )}
    </Manager>
  );
}
