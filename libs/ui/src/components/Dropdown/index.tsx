import type { Nullable } from '@voiceflow/common';
import React, { Fragment } from 'react';
import { DismissableLayerProvider, useDismissable } from 'react-dismissable-layers';
import type { StrictModifier } from 'react-popper';

import type { MenuTypes } from '@/components/Menu';
import Menu from '@/components/Menu';
import Portal from '@/components/Portal';
import { useNestedPopperTheme } from '@/hooks';
import { useCachedValue } from '@/hooks/cache';
import type { PopperPlacement } from '@/hooks/popper';
import { usePopper } from '@/hooks/popper';
import { ThemeProvider } from '@/styles';

import { PopoverContainer } from './components';

const DEFAULT_PORTAL_NODE = globalThis.document?.body;

export type DropdownPlacement = PopperPlacement;

export interface DropdownProps<Value = void> {
  menu?: React.ReactNode | ((onToggle: VoidFunction) => void);
  portal?: HTMLElement | null;
  zIndex?: string | number;
  offset?: StrictModifier<'offset'>['options'];
  onClose?: VoidFunction;
  options?: Nullable<MenuTypes.Option<Value>>[];
  onSelect?: MenuTypes.OnSelect<Value>;
  noScroll?: boolean;
  children: (options: {
    ref: React.Ref<any>;
    isOpen: boolean;
    popper: React.ReactNode;
    onClose: VoidFunction;
    onToggle: VoidFunction;
  }) => React.ReactNode;
  menuHint?: React.ReactNode;
  maxHeight?: number | string;
  menuWidth?: number;
  placement?: DropdownPlacement;
  autoWidth?: boolean;
  inlinePopper?: boolean;
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
  onClose: onCloseProp,
  options,
  noScroll,
  onSelect,
  menuHint,
  children,
  menuWidth,
  maxHeight,
  placement = 'bottom-start',
  autoWidth = false,
  selfDismiss = false,
  inlinePopper = false,
  disabledOverlay = false,
  preventOverflow,
  maxVisibleItems,
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
  const [isOpen, onToggle, onClose] = useDismissable(false, {
    ref: selfDismiss ? dismissableRef : undefined,
    onClose: onCloseProp,
    disableLayers: disabledOverlay,
  });

  const Wrapper = portal ? Portal : Fragment;
  const wrapperProps = portal ? { portalNode: portal } : {};

  const popperElement = isOpen && (
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
                  hint={menuHint}
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
  );

  return (
    <>
      {children({
        ref: popper.setReferenceElement,
        isOpen,
        popper: inlinePopper ? popperElement : null,
        onClose,
        onToggle,
      })}

      {!inlinePopper && popperElement}
    </>
  );
};

export default Dropdown;
