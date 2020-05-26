import React from 'react';

import { BlockAPI } from '../../types';

export type InternalBlockAPI<T extends HTMLElement = HTMLElement> = BlockAPI<T> & {
  titleRef: React.RefObject<HTMLInputElement>;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
};

// eslint-disable-next-line import/prefer-default-export
export const useBlockAPI = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  return React.useMemo<InternalBlockAPI<HTMLDivElement>>(
    () => ({
      ref,
      titleRef,
      isEditing,
      getRect: () => ref.current!.getBoundingClientRect(),
      rename: () => {
        setIsEditing(true);
        titleRef.current?.focus();
      },
      addEventListener: (event, listener) => ref.current?.addEventListener(event, listener),
      removeEventListener: (event, listener) => ref.current?.removeEventListener(event, listener),
      setIsEditing,
    }),
    [isEditing]
  );
};
