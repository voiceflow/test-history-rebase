import { Nullable } from '@voiceflow/common';
import { PopperAPI, Portal, usePopper, VirtualElement } from '@voiceflow/ui';
import React from 'react';

import { StepItem } from '../../constants';
import { SubMenuButton, SubMenuContainer } from './components';

const SubMenu = React.forwardRef<
  PopperAPI<Nullable<Element | VirtualElement>, Nullable<HTMLElement>>,
  { steps: StepItem[]; subMenuRef?: React.Ref<HTMLDivElement> }
>(({ steps, subMenuRef }, ref) => {
  const rootPopper = usePopper({
    modifiers: [
      { name: 'offset', options: { offset: [-70, 8] } },
      { name: 'preventOverflow', options: { boundary: document.body } },
    ],
    strategy: 'fixed',
    placement: 'right-start',
  });

  React.useImperativeHandle(ref, () => rootPopper, [rootPopper]);

  return (
    <div ref={rootPopper.setReferenceElement}>
      <Portal portalNode={document.body}>
        <div ref={rootPopper.setPopperElement} style={rootPopper.styles.popper} {...rootPopper.attributes.popper}>
          <SubMenuContainer ref={subMenuRef}>
            {steps.map((step) => (
              <SubMenuButton key={step.name} />
            ))}
          </SubMenuContainer>
        </div>
      </Portal>
    </div>
  );
});

export default SubMenu;
