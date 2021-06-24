import composeRefs from '@seznam/compose-react-refs';
import React, { Fragment } from 'react';
import { Manager, Popper, PopperProps, Reference } from 'react-popper';

import { useDismissable } from '../../hooks';
import { Nullable } from '../../types';
import Menu, { MenuOption, MenuProps } from '../Menu';
import Portal from '../Portal';
import { PopoverContainer } from './components';

export { PopoverContainer } from './components';

const DEFAULT_PORTAL_NODE = document.body;

export type DropdownPlacement = PopperProps['placement'];

export type DropdownProps<T> = {
  menu?: React.ReactNode | ((onToggle: () => void) => void);
  portal?: HTMLElement | null;
  zIndex?: string | number;
  onClose?: () => void;
  options?: MenuOption<T>[];
  onSelect?: MenuProps<T>['onSelect'];
  noScroll?: boolean;
  children: (ref: React.Ref<any>, onToggle: () => void, isOpen: boolean) => React.ReactNode;
  maxHeight?: number | string;
  placement?: DropdownPlacement;
  autoWidth?: boolean;
  autoDismiss?: boolean;
  selfDismiss?: boolean;
  preventOverflow?: NonNullable<PopperProps['modifiers']>['preventOverflow'];
  maxVisibleItems?: number;
};

const Dropdown = <T extends any = undefined>({
  menu,
  portal = DEFAULT_PORTAL_NODE,
  zIndex,
  onClose,
  options,
  noScroll,
  onSelect,
  children,
  maxHeight,
  placement = 'bottom-start',
  autoWidth = false,
  selfDismiss = false,
  autoDismiss = false,
  preventOverflow = { enabled: false },
  maxVisibleItems,
}: // eslint-disable-next-line sonarjs/cognitive-complexity
DropdownProps<T>) => {
  const containerRef = React.useRef<Nullable<HTMLDivElement>>(null);

  const [isOpen, onToggle] = useDismissable(false, { onClose, autoDismiss, ref: selfDismiss ? containerRef : undefined });
  const [childRef, setChildRef] = React.useState<Nullable<HTMLElement>>(null);

  const onComputedStyle = React.useCallback(
    (data) => {
      if (childRef && placement === 'bottom-start') {
        // eslint-disable-next-line no-param-reassign
        data.styles.width = childRef.getBoundingClientRect().width;
      }
      return data;
    },
    [placement, childRef]
  );

  const Wrapper = portal ? Portal : Fragment;
  const wrapperProps = portal ? { portalNode: portal } : {};

  return (
    <Manager>
      <Reference innerRef={(node) => setChildRef(node)}>{({ ref }) => children(ref, onToggle, isOpen)}</Reference>

      {isOpen && (
        <Wrapper {...wrapperProps}>
          <Popper
            placement={placement}
            modifiers={{
              hide: { enabled: false },
              autoSizing: { enabled: true, fn: onComputedStyle, order: 840 },
              preventOverflow,
            }}
          >
            {({ ref, style, placement }) => (
              <PopoverContainer
                ref={composeRefs(containerRef, ref)}
                style={
                  // eslint-disable-next-line no-nested-ternary
                  portal
                    ? style
                    : childRef
                    ? {
                        position: 'absolute',
                        left: `${childRef.offsetLeft}px`,
                        top: `${childRef.offsetTop + childRef.offsetHeight}px`,
                      }
                    : undefined
                }
                zIndex={zIndex}
                noScroll={noScroll}
                autoWidth={autoWidth}
                data-placement={placement}
              >
                {(typeof menu === 'function' ? menu(onToggle) : menu) ||
                  (options && <Menu<T> options={options} onSelect={onSelect} maxHeight={maxHeight} maxVisibleItems={maxVisibleItems} />)}
              </PopoverContainer>
            )}
          </Popper>
        </Wrapper>
      )}
    </Manager>
  );
};

export default Dropdown;
