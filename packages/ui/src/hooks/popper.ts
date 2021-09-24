/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { VirtualElement } from '@popperjs/core';
import { usePopper as usePopperBase } from 'newpopper';
import { useState } from 'react';

import { Nullable } from '../types';

type PopperParameters = Parameters<typeof usePopperBase>;
type TriggerElement = PopperParameters[0];
type PopperElement = PopperParameters[1];
type PopperOptions = PopperParameters[2];

export type { Placement as PopperPlacement } from '@popperjs/core';

export const usePopper = <TTriggerRef extends TriggerElement, TPopperRef extends PopperElement>(popperOptions?: PopperOptions) => {
  const [referenceElement, setReferenceElement] = useState<Nullable<TTriggerRef>>(null);
  const [popperElement, setPopperElement] = useState<Nullable<TPopperRef>>(null);
  const popperProps = usePopperBase(referenceElement, popperElement, popperOptions);

  return {
    referenceElement,
    setReferenceElement,
    popperElement,
    setPopperElement,
    ...popperProps,
  };
};

export const useVirtualElementPopper = <TPopperRef extends PopperElement>(
  virtualElement: Nullable<VirtualElement>,
  popperOptions?: PopperOptions
) => {
  const [popperElement, setPopperElement] = useState<Nullable<TPopperRef>>(null);
  const popperProps = usePopperBase(virtualElement, popperElement, popperOptions);

  return {
    popperElement,
    setPopperElement,
    ...popperProps,
  };
};
