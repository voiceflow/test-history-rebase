/* eslint-disable no-shadow */
import type { PopperPlacement } from '@voiceflow/ui';
import { Portal, portalRootNode, stopPropagation, usePopper } from '@voiceflow/ui';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';

import { FadeDownDelayedContainer, SlideContainer } from '@/styles/animations';

import { Container, JSONCode, Paragraph, Section, Title } from './components';

export { JSONCode, Paragraph, Section, Title };

export interface TooltipProps {
  placement?: PopperPlacement;
  portalNode?: HTMLElement;
  anchorRenderer: (props: { ref: React.Ref<any>; isOpen: boolean; onToggle: VoidFunction }) => React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ anchorRenderer, placement = 'auto-end', children, portalNode }) => {
  const [isOpen, onToggle] = useDismissable(false);

  const popper = usePopper({
    placement,
    modifiers: [{ name: 'preventOverflow', options: { boundary: portalRootNode, padding: 19 } }],
  });

  return (
    <>
      {anchorRenderer({ ref: popper.setReferenceElement, isOpen, onToggle })}
      {isOpen && (
        <Portal portalNode={portalNode}>
          <div ref={popper.setPopperElement} style={{ ...popper.styles.popper }} {...popper.attributes.popper}>
            <SlideContainer onClick={stopPropagation(null, true)}>
              <Container>
                <FadeDownDelayedContainer>{children}</FadeDownDelayedContainer>
              </Container>
            </SlideContainer>
          </div>
        </Portal>
      )}
    </>
  );
};

export default Tooltip;
