import { Menu, Portal, usePopper } from '@voiceflow/ui';
import React from 'react';

interface SubMenuProps {
  children?: React.ReactNode;
}

const getPopperOffset = ({ placement }: { placement: string }): [number, number] =>
  placement === 'right-end' ? [0, 0] : [-40, 0];

const SubMenu = React.forwardRef<HTMLDivElement, SubMenuProps>(({ children }, ref) => {
  const rootPopper = usePopper({
    modifiers: [{ name: 'offset', options: { offset: getPopperOffset } }],
    placement: 'right-start',
  });

  return (
    <div ref={rootPopper.setReferenceElement}>
      <Portal portalNode={document.body}>
        <div ref={rootPopper.setPopperElement} style={rootPopper.styles.popper} {...rootPopper.attributes.popper}>
          <div ref={ref}>
            <Menu noMargins>{children}</Menu>
          </div>
        </div>
      </Portal>
    </div>
  );
});

export default SubMenu;
