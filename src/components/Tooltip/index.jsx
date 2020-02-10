/* eslint-disable no-shadow */
import React from 'react';
import { Manager, Popper, Reference } from 'react-popper';

import Portal, { rootNode } from '@/components/Portal';
import { useDismissable } from '@/hooks/dismiss';
import { FadeDownContainer, SlideContainer } from '@/styles/animations';
import { stopPropagation } from '@/utils/dom';

import { Container, JSONCode, Paragraph, Section, Title } from './components';

export { Title, Section, Paragraph, JSONCode };

export default function Tooltip({ anchorRenderer, placement = 'auto-end', children, portalNode }) {
  const [isOpen, onToggle] = useDismissable(false, null, false);

  return (
    <Manager>
      <Reference>{({ ref }) => anchorRenderer({ ref, isOpen, onToggle })}</Reference>
      {isOpen && (
        <Portal portalNode={portalNode}>
          <Popper modifiers={{ preventOverflow: { padding: 19, boundariesElement: rootNode } }} placement={placement}>
            {({ ref, style, placement }) => (
              <div ref={ref} style={{ ...style, zIndex: 1100 }} data-placement={placement}>
                <SlideContainer delay={0} onClick={stopPropagation(null, true)}>
                  <Container>
                    <FadeDownContainer>{children}</FadeDownContainer>
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
