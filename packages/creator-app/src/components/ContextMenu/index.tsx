import { Menu, MenuOption, MenuProps, PopperPlacement, Portal, useVirtualElementPopper } from '@voiceflow/ui';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';

import { Identifier } from '@/styles/constants';
import { Point } from '@/types';
import { buildVirtualElement } from '@/utils/dom';

const EXCLUDED_TAG_NAME = new Set(['input', 'textarea']);

export const CONTEXT_MENU_IGNORED_CLASS_NAME = 'context-menu-exclude';

interface ContextMenuProps<T> extends Omit<MenuProps<T>, 'options' | 'children'> {
  options: MenuOption<T>[];
  children: (props: { isOpen: boolean; onContextMenu: (event: React.MouseEvent<HTMLElement>) => void }) => React.ReactNode;
  placement?: PopperPlacement;
}

const ContextMenu = <T extends any>({
  children,
  placement = 'bottom-start',
  options,
  ...props
}: ContextMenuProps<T>): React.ReactElement<any, any> => {
  const [virtualElement, setVirtualElement] = React.useState<ReturnType<typeof buildVirtualElement> | null>(null);
  const popper = useVirtualElementPopper(virtualElement, { placement });
  const [isOpen, onToggle] = useDismissable(false);

  const onContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    // eslint-disable-next-line xss/no-mixed-html
    const target = event?.target as HTMLElement | null;

    // .closest() - supported in all browsers except IE
    if (target && (EXCLUDED_TAG_NAME.has(target.tagName.toLowerCase()) || target.closest?.(`.${CONTEXT_MENU_IGNORED_CLASS_NAME}`))) {
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

      {isOpen && !!options.length && (
        <Portal portalNode={document.body}>
          <div id={Identifier.CONTEXT_MENU} ref={popper.setPopperElement} style={{ ...popper.styles.popper }} {...popper.attributes.popper}>
            <Menu onToggle={onToggle} options={options} {...props} />
          </div>
        </Portal>
      )}
    </>
  );
};

export default ContextMenu;
