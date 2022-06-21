import { Nullable } from '@voiceflow/common';
import { ColorPicker, ColorPickerProps, PopperAPI, PopperPlacement, Portal, StrictPopperModifiers, usePopper, VirtualElement } from '@voiceflow/ui';
import React from 'react';

import * as Project from '@/ducks/project';
import { customThemesSelector } from '@/ducks/projectV2/selectors/active/base';
import { useDispatch, useSelector } from '@/hooks';

export interface ColorPickerPopperProps extends ColorPickerProps {
  popperContainerRef?: React.Ref<HTMLDivElement>;
  modifiers?: StrictPopperModifiers;
  placement?: PopperPlacement;
}

export const ColorPickerPopper = React.forwardRef<
  PopperAPI<Nullable<Element | VirtualElement>, Nullable<HTMLElement>>,
  Omit<ColorPickerPopperProps, 'addCustomTheme'>
>(({ modifiers = [], placement = 'bottom', popperContainerRef, ...props }, ref) => {
  const colors = useSelector(customThemesSelector);
  const addCustomTheme = useDispatch(Project.addCustomThemeToProject);
  const editCustomTheme = useDispatch(Project.editCustomThemeOnProject);
  const removeCustomTheme = useDispatch(Project.removeCustomThemeOnProject);

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
            <ColorPicker
              {...props}
              addCustomTheme={addCustomTheme}
              editCustomTheme={editCustomTheme}
              removeCustomTheme={removeCustomTheme}
              customThemes={colors}
            />
          </div>
        </div>
      </Portal>
    </div>
  );
});
