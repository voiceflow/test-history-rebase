import { Nullish } from '@voiceflow/common';
import type { Ref } from 'react';

export const setRef = <T>(ref: Nullish<Ref<T | null>>, value: T | null): void => {
  if (!ref) return;

  if (typeof ref === 'function') {
    ref(value);
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    ref.current = value;
  }
};
