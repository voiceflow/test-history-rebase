import _isFunction from 'lodash/isFunction';
import React, { Fragment } from 'react';
import { Manager, Popper, PopperProps, RefHandler, Reference } from 'react-popper';

import Menu, { MenuOption, MenuProps } from '@/components/Menu';
import Portal from '@/components/Portal';
import { useDismissable } from '@/hooks';
import { Nullable } from '@/types';

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
  children: (ref: RefHandler, onToggle: () => void, isOpen: boolean) => React.ReactNode;
  maxHeight?: number | string;
  placement?: DropdownPlacement;
  autoWidth?: boolean;
  selfDismiss?: boolean;
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
  maxVisibleItems,
}: DropdownProps<T>) => {
  const containerRef = React.useRef<Nullable<HTMLDivElement>>(null);

  const [isOpen, onToggle] = useDismissable(false, onClose, false, selfDismiss ? containerRef : undefined);
  const [childRef, setChildRef] = React.useState<Nullable<HTMLElement>>(null);

  const onComputedStyle = React.useCallback(
    (data) => {
      if (childRef && placement === 'bottom-start') {
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
              preventOverflow: { enabled: false },
            }}
          >
            {({ ref, style, placement }) => (
              <PopoverContainer
                ref={(container) => {
                  ref(container);
                  containerRef.current = container;
                }}
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
                {(_isFunction(menu) ? menu(onToggle) : menu) ||
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
