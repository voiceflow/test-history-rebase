import type { Nullable } from '@voiceflow/common';
import type {
  ColorPickerProps,
  PopperAPI,
  PopperPlacement,
  StrictPopperModifiers,
  VirtualElement,
} from '@voiceflow/ui';
import { ColorPicker, Portal, usePopper } from '@voiceflow/ui';
import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';

export interface ColorPickerPopperProps
  extends Omit<ColorPickerProps, 'customThemes' | 'addCustomTheme' | 'editCustomTheme' | 'removeCustomTheme'> {
  modifiers?: StrictPopperModifiers;
  placement?: PopperPlacement;
  popperContainerRef?: React.Ref<HTMLDivElement>;
}

export interface ColorPickerPopperRef extends PopperAPI<Nullable<Element | VirtualElement>, Nullable<HTMLElement>> {}

export const ColorPickerPopper = React.forwardRef<ColorPickerPopperRef, ColorPickerPopperProps>(
  ({ modifiers = [], placement = 'bottom', popperContainerRef, ...props }, ref) => {
    const colors = useSelector(ProjectV2.active.customThemesSelector);
    const addCustomTheme = useDispatch(ProjectV2.addCustomThemeToProject);
    const editCustomTheme = useDispatch(ProjectV2.editCustomThemeOnProject);
    const removeCustomTheme = useDispatch(ProjectV2.removeCustomThemeOnProject);

    const rootPopper = usePopper({
      modifiers: [
        { name: 'offset', options: { offset: [0, 0] } },
        { name: 'preventOverflow', options: { boundary: document.body } },
        ...modifiers,
      ],
      strategy: 'fixed',
      placement,
    });

    React.useImperativeHandle(ref, () => rootPopper, [rootPopper]);

    return (
      <div ref={rootPopper.setReferenceElement}>
        <Portal portalNode={document.body}>
          <div ref={rootPopper.setPopperElement} style={rootPopper.styles.popper} {...rootPopper.attributes.popper}>
            <div ref={popperContainerRef}>
              <ColorPicker
                {...props}
                customThemes={colors}
                addCustomTheme={addCustomTheme}
                editCustomTheme={editCustomTheme}
                removeCustomTheme={removeCustomTheme}
              />
            </div>
          </div>
        </Portal>
      </div>
    );
  }
);
