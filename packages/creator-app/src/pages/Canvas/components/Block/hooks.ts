import React from 'react';

import { EditableTextAPI } from '@/components/EditableText';

import { BlockAPI } from '../../types';

export type InternalBlockAPI<T extends HTMLElement = HTMLElement> = BlockAPI<T> & {
  titleRef: React.RefObject<EditableTextAPI>;
};

// eslint-disable-next-line import/prefer-default-export
export const useBlockAPI = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<EditableTextAPI | null>(null);

  return React.useMemo<InternalBlockAPI<HTMLDivElement>>(
    () => ({
      ref,
      titleRef,
      getRect: () => ref.current!.getBoundingClientRect(),
      rename: () => {
        titleRef.current?.startEditing();
      },
      addEventListener: (event, listener) => ref.current?.addEventListener(event, listener),
      removeEventListener: (event, listener) => ref.current?.removeEventListener(event, listener),
    }),
    []
  );
};
