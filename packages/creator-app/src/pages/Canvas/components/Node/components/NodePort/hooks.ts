import { Utils } from '@voiceflow/common';
import _constant from 'lodash/constant';
import React from 'react';

import { PortInstance } from '@/pages/Canvas/engine/entities/portEntity';

// eslint-disable-next-line import/prefer-default-export
export const usePortInstance = (getAnchorPoint: () => DOMRect | null) =>
  React.useMemo<PortInstance>(
    () => ({
      addClass: Utils.functional.noop,
      removeClass: Utils.functional.noop,
      isReady: _constant(true),
      getRect: getAnchorPoint,
    }),
    [getAnchorPoint]
  );
