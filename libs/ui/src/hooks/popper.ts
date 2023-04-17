import type * as PopperJS from '@popperjs/core';
import { Nullable } from '@voiceflow/common';
import { Modifier, usePopper as usePopperBase } from 'newpopper';
import { useState } from 'react';

import { useTheme } from './theme';

export type { Placement as PopperPlacement } from '@popperjs/core';
export interface PopperOptions<Modifiers> extends Omit<Partial<PopperJS.Options>, 'modifiers'> {
  modifiers?: ReadonlyArray<Modifier<Modifiers>>;
  createPopper?: typeof PopperJS.createPopper;
}

export type StrictPopperModifierNames = NonNullable<PopperJS.StrictModifiers['name']>;
export type StrictPopperModifiers = ReadonlyArray<Modifier<StrictPopperModifierNames>>;
export type VirtualElement = PopperJS.VirtualElement;

interface BasePopperAPI {
  state: PopperJS.State | null;
  update: PopperJS.Instance['update'] | null;
  styles: { popper?: React.CSSProperties };
  attributes: { popper?: Record<string, string> };
  forceUpdate: PopperJS.Instance['forceUpdate'] | null;
}

export interface PopperAPI<TriggerRef extends Nullable<Element | PopperJS.VirtualElement>, PopperRef extends Nullable<HTMLElement>>
  extends BasePopperAPI {
  popperElement: Nullable<PopperRef>;
  setPopperElement: React.Dispatch<React.SetStateAction<Nullable<PopperRef>>>;
  referenceElement: Nullable<TriggerRef>;
  setReferenceElement: React.Dispatch<React.SetStateAction<Nullable<TriggerRef>>>;
}

export const usePopper = <TriggerRef extends Nullable<Element | PopperJS.VirtualElement>, PopperRef extends Nullable<HTMLElement>, Modifiers>(
  popperOptions?: PopperOptions<Modifiers>
): PopperAPI<TriggerRef, PopperRef> => {
  const theme = useTheme();

  const [popperElement, setPopperElement] = useState<Nullable<PopperRef>>(null);
  const [referenceElement, setReferenceElement] = useState<Nullable<TriggerRef>>(null);

  const popperProps = usePopperBase(referenceElement, popperElement, popperOptions);

  if (popperProps.styles.popper) {
    popperProps.styles.popper = {
      ...popperProps.styles.popper,
      zIndex: theme.zIndex.popper,
    };
  }

  return {
    ...popperProps,
    popperElement,
    setPopperElement,
    referenceElement,
    setReferenceElement,
  };
};

interface VirtualPopperAPI<PopperRef extends Nullable<HTMLElement>> extends BasePopperAPI {
  popperElement: Nullable<PopperRef>;
  setPopperElement: React.Dispatch<React.SetStateAction<Nullable<PopperRef>>>;
}

export const useVirtualElementPopper = <VirtualElement extends Nullable<PopperJS.VirtualElement>, PopperRef extends Nullable<HTMLElement>, Modifiers>(
  virtualElement: VirtualElement,
  popperOptions?: PopperOptions<Modifiers>
): VirtualPopperAPI<PopperRef> => {
  const theme = useTheme();

  const [popperElement, setPopperElement] = useState<Nullable<PopperRef>>(null);

  const popperProps = usePopperBase(virtualElement, popperElement, popperOptions);

  if (popperProps.styles.popper) {
    popperProps.styles.popper.zIndex = theme.zIndex.popper;
  }

  return {
    ...popperProps,
    popperElement,
    setPopperElement,
  };
};
