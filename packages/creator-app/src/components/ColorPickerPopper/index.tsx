import { Nullable } from '@voiceflow/common';
import { ColorPicker, ColorPickerProps, PopperAPI, PopperPlacement, Portal, StrictPopperModifiers, usePopper, VirtualElement } from '@voiceflow/ui';
import React from 'react';

export interface ColorPickerPopperProps extends ColorPickerProps {
  popperContainerRef?: React.Ref<HTMLDivElement>;
  modifiers?: StrictPopperModifiers;
  placement?: PopperPlacement;
}

export const ColorPickerPopper = React.forwardRef<PopperAPI<Nullable<Element | VirtualElement>, Nullable<HTMLElement>>, ColorPickerPopperProps>(
  ({ modifiers = [], placement = 'bottom', popperContainerRef, ...props }, ref) => {
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
            <div ref={popperContainerRef}>
              <ColorPicker {...props} />
            </div>
          </div>
        </Portal>
      </div>
    );
  }
);
