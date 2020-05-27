import _constant from 'lodash/constant';
import React from 'react';

import { PortInstance } from '@/pages/Canvas/engine/entities/portEntity';
import { noop } from '@/utils/functional';

// eslint-disable-next-line import/prefer-default-export
export const usePortInstance = (getAnchorPoint: () => DOMRect | null) =>
  React.useMemo<PortInstance>(
    () => ({
      addClass: noop,
      removeClass: noop,
      isReady: _constant(true),
      getRect: getAnchorPoint,
    }),
    [getAnchorPoint]
  );
