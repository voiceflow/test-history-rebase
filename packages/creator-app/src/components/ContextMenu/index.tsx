import { Menu, MenuOption, PopperPlacement, Portal, useVirtualElementPopper } from '@voiceflow/ui';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';

import { Identifier } from '@/styles/constants';
import { Point } from '@/types';
import { buildVirtualElement } from '@/utils/dom';

const EXCLUDED_TAG_NAME = ['input', 'textarea'];

export const CONTEXT_MENU_IGNORED_CLASS_NAME = 'context-menu-exclude';

interface ContextMenuProps<T> {
  options: MenuOption<T>[];
  placement?: PopperPlacement;
  children: (props: { isOpen: boolean; onContextMenu: (event: React.MouseEvent<HTMLElement>) => void }) => React.ReactNode;
}

const ContextMenu = <T extends any>({ children, placement = 'bottom-start', ...props }: ContextMenuProps<T>) => {
  const [virtualElement, setVirtualElement] = React.useState<ReturnType<typeof buildVirtualElement> | null>(null);
  const popper = useVirtualElementPopper(virtualElement, { placement });
  const [isOpen, onToggle] = useDismissable(false);

  const onContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    const target: any = event?.target;

    // .closest() - supported in all browsers except IE
    if (EXCLUDED_TAG_NAME.includes(target?.tagName.toLowerCase()) || target?.closest?.(`.${CONTEXT_MENU_IGNORED_CLASS_NAME}`)) {
      return;
    }

    event?.preventDefault();
    event?.stopPropagation();

    setVirtualElement(buildVirtualElement([event.clientX, event.clientY] as Point));

    if (!isOpen) {
      onToggle();
    }
  };

  return (
    <>
      {children({ isOpen, onContextMenu })}

      {isOpen && (
        <Portal portalNode={document.body}>
          <div
            id={Identifier.CONTEXT_MENU}
            ref={popper.setPopperElement}
            style={{ ...popper.styles.popper, zIndex: 1100 }}
            {...popper.attributes.popper}
          >
            <Menu {...(props as any)} />
          </div>
        </Portal>
      )}
    </>
  );
};

export default ContextMenu;
