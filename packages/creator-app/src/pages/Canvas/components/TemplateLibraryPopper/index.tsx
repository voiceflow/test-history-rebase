import { Nullable } from '@voiceflow/common';
import { PopperAPI, PopperPlacement, Portal, StrictPopperModifiers, usePopper, VirtualElement } from '@voiceflow/ui';
import React from 'react';

import { TemplatePopperContent } from './components';
import { TemplatePopperContentProps } from './types';

export interface TemplateLibraryPopperProps extends TemplatePopperContentProps {
  modifiers?: StrictPopperModifiers;
  placement?: PopperPlacement;
}

export interface TemplateLibraryPopperRef extends PopperAPI<Nullable<Element | VirtualElement>, Nullable<HTMLElement>> {}

export const TemplateLibraryPopper = React.forwardRef<TemplateLibraryPopperRef, TemplateLibraryPopperProps>(
  ({ modifiers = [], placement = 'bottom', ...props }, ref) => {
    const rootPopper = usePopper({
      modifiers: [{ name: 'offset', options: { offset: [0, 0] } }, { name: 'preventOverflow', options: { boundary: document.body } }, ...modifiers],
      strategy: 'fixed',
      placement,
    });

    React.useImperativeHandle(ref, () => rootPopper, [rootPopper]);

    return (
      <div ref={rootPopper.setReferenceElement}>
        <Portal portalNode={document.body}>
          <div ref={rootPopper.setPopperElement} style={rootPopper.styles.popper} {...rootPopper.attributes.popper}>
            <TemplatePopperContent {...props} />
          </div>
        </Portal>
      </div>
    );
  }
);
