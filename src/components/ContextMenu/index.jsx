import React from 'react';
import { Popper } from 'react-popper';

import Menu from '@/components/Menu';
import Portal from '@/components/Portal';
import { useDismissable } from '@/hooks/dismiss';
import { buildVirtualElement } from '@/utils/dom';

const EXCLUDED_TAG_NAME = ['input', 'textarea'];

export const CONTEXT_MENU_IGNORED_CLASS_NAME = 'context-menu-exclude';

const ContextMenu = ({ children, placement = 'bottom-start', ...props }) => {
  const [virtualElememt, setVirtualElement] = React.useState(null);
  const [isOpen, onToggle] = useDismissable(false, null, true);

  const onContextMenu = (e) => {
    const target = e?.target;

    // .closest() - supported in all browsers except IE
    if (EXCLUDED_TAG_NAME.includes(target?.tagName.toLowerCase()) || target?.closest?.(`.${CONTEXT_MENU_IGNORED_CLASS_NAME}`)) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    setVirtualElement(buildVirtualElement([e.clientX, e.clientY]));

    if (!isOpen) {
      onToggle();
    }
  };

  return (
    <>
      {children({ isOpen, onContextMenu })}

      {isOpen && (
        <Portal portalNode={document.body}>
          <Popper referenceElement={virtualElememt} placement={placement}>
            {({ ref, style, placement }) => (
              <div ref={ref} style={{ ...style, zIndex: 1100 }} data-placement={placement}>
                <Menu {...props} />
              </div>
            )}
          </Popper>
        </Portal>
      )}
    </>
  );
};

export default ContextMenu;
