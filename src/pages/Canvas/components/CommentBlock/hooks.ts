import _constant from 'lodash/constant';
import React from 'react';

import { BlockAPI } from '@/pages/Canvas/types';
import { noop } from '@/utils/functional';

// eslint-disable-next-line import/prefer-default-export
export const useCommentBlockAPI = <T extends HTMLElement = HTMLElement>() => {
  const ref = React.useRef<T>(null);

  return React.useMemo<BlockAPI<T>>(
    () => ({
      ref,
      getRect: _constant(null),
      rename: noop,
      addEventListener: noop,
      removeEventListener: noop,
    }),
    []
  );
};
