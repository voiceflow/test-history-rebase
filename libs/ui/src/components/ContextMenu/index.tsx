import type { Nullable } from '@voiceflow/common';
import React from 'react';
import type { DismissEventType } from 'react-dismissable-layers';
import { useDismissable } from 'react-dismissable-layers';

import type { MenuTypes } from '@/components/Menu';
import Menu from '@/components/Menu';
import Portal from '@/components/Portal';
import type { PopperPlacement } from '@/hooks';
import { useVirtualElementPopper } from '@/hooks';
import { Identifier } from '@/styles/constants';
import type { Point } from '@/types';
import { buildVirtualElement } from '@/utils/dom';

const EXCLUDED_TAG_NAME = new Set(['input', 'textarea']);

export const CONTEXT_MENU_IGNORED_CLASS_NAME = 'context-menu-exclude';

export interface ContextMenuProps<Value = void> extends MenuTypes.BaseProps {
  options: Nullable<MenuTypes.Option<Value>>[];
  children: (props: {
    isOpen: boolean;
    onContextMenu: (event: React.MouseEvent<HTMLElement>) => void;
  }) => React.ReactNode;
  placement?: PopperPlacement;
  dismissEvent?: DismissEventType;
  disableLayers?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const ContextMenu = <Value extends unknown = void>({
  options,
  children,
  placement = 'bottom-start',
  dismissEvent,
  disableLayers,
  ...props
}: ContextMenuProps<Value>): React.ReactElement => {
  const [virtualElement, setVirtualElement] = React.useState<ReturnType<typeof buildVirtualElement> | null>(null);
  const popper = useVirtualElementPopper(virtualElement, { placement });
  const [isOpen, onToggle] = useDismissable(false, { disableLayers, dismissEvent });

  const onContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    const target = event?.target as HTMLElement | null;

    // .closest() - supported in all browsers except IE
    if (
      target &&
      (EXCLUDED_TAG_NAME.has(target.tagName.toLowerCase()) || target.closest?.(`.${CONTEXT_MENU_IGNORED_CLASS_NAME}`))
    ) {
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
          <div
            id={Identifier.CONTEXT_MENU}
            ref={popper.setPopperElement}
            style={{ ...popper.styles.popper }}
            {...popper.attributes.popper}
          >
            <Menu onToggle={onToggle} options={options} {...props} />
          </div>
        </Portal>
      )}
    </>
  );
};

export default ContextMenu;
