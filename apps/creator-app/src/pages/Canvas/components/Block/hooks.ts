import { useConst } from '@voiceflow/ui';
import React from 'react';

import type { EditableTextAPI } from '@/components/EditableText';

import type { CombinedAPI } from '../../types';

export interface InternalBlockAPI<T extends HTMLElement = HTMLElement> extends CombinedAPI<T> {
  titleRef: React.RefObject<EditableTextAPI>;
}

export const useBlockAPI = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<EditableTextAPI | null>(null);

  return useConst<InternalBlockAPI<HTMLDivElement>>({
    ref,
    titleRef,

    rename: () => titleRef.current?.startEditing(),
    getRect: () => ref.current?.getBoundingClientRect() ?? null,
    addEventListener: (event, listener) => ref.current?.addEventListener(event, listener),
    removeEventListener: (event, listener) => ref.current?.removeEventListener(event, listener),
  });
};
