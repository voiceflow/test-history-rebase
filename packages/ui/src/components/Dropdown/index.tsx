import Menu, { MenuTypes } from '@ui/components/Menu';
import Portal from '@ui/components/Portal';
import { useNestedPopperTheme } from '@ui/hooks';
import { useCachedValue } from '@ui/hooks/cache';
import { PopperPlacement, usePopper } from '@ui/hooks/popper';
import { ThemeProvider } from '@ui/styles';
import { Nullable } from '@voiceflow/common';
import { StrictModifier } from 'newpopper';
import React, { Fragment } from 'react';
import { DismissableLayerProvider, useDismissable } from 'react-dismissable-layers';

import { PopoverContainer } from './components';

const DEFAULT_PORTAL_NODE = globalThis.document?.body;

export type DropdownPlacement = PopperPlacement;

export interface DropdownProps<Value = void> {
  menu?: React.ReactNode | ((onToggle: () => void) => void);
  portal?: HTMLElement | null;
  zIndex?: string | number;
  offset?: StrictModifier<'offset'>['options'];
  onClose?: () => void;
  options?: Nullable<MenuTypes.Option<Value>>[];
  onSelect?: MenuTypes.OnSelect<Value>;
  noScroll?: boolean;
  children: (ref: React.Ref<any>, onToggle: () => void, isOpen: boolean) => React.ReactNode;
  maxHeight?: number | string;
  menuWidth?: number;
  placement?: DropdownPlacement;
  autoWidth?: boolean;
  dropdownText?: string;
  selfDismiss?: boolean;
  disabledOverlay?: boolean;
  preventOverflow?: StrictModifier<'preventOverflow'>['options'];
  maxVisibleItems?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const Dropdown = <Value extends unknown = void>({
  menu,
  portal = DEFAULT_PORTAL_NODE,
  zIndex,
  offset,
  onClose,
  options,
  noScroll,
  onSelect,
  children,
  menuWidth,
  maxHeight,
  placement = 'bottom-start',
  autoWidth = false,
  selfDismiss = false,
  disabledOverlay = false,
  preventOverflow,
  maxVisibleItems,
  dropdownText,
}: DropdownProps<Value>): React.ReactElement => {
  const popper = usePopper({
    placement,
    modifiers: [
      { name: 'hide', options: { enabled: false } },
      { name: 'offset', options: offset },
      { name: 'preventOverflow', options: preventOverflow },
    ],
  });

  const nestedTheme = useNestedPopperTheme();
  const dismissableRef = useCachedValue(popper.popperElement as Element);
  const [isOpen, onToggle] = useDismissable(false, { onClose, disableLayers: disabledOverlay, ref: selfDismiss ? dismissableRef : undefined });

  const Wrapper = portal ? Portal : Fragment;
  const wrapperProps = portal ? { portalNode: portal } : {};

  return (
    <>
      {children(popper.setReferenceElement, onToggle, isOpen)}

      {isOpen && (
        <Wrapper {...wrapperProps}>
          <PopoverContainer
            ref={popper.setPopperElement}
            style={popper.styles.popper}
            zIndex={zIndex}
            noScroll={noScroll}
            autoWidth={autoWidth}
            {...popper.attributes.popper}
          >
            <DismissableLayerProvider>
              <ThemeProvider theme={nestedTheme}>
                {(typeof menu === 'function' ? menu(onToggle) : menu) ||
                  (options && (
                    <Menu<Value>
                      menuText={dropdownText}
                      width={menuWidth}
                      options={options}
                      onSelect={onSelect}
                      onToggle={onToggle}
                      maxHeight={maxHeight}
                      selfDismiss={selfDismiss}
                      maxVisibleItems={maxVisibleItems}
                    />
                  ))}
              </ThemeProvider>
            </DismissableLayerProvider>
          </PopoverContainer>
        </Wrapper>
      )}
    </>
  );
};

export default Dropdown;
