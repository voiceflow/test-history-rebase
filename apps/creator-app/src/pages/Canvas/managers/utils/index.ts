import { Utils } from '@voiceflow/common';
import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockType } from '@/constants';
import * as Feature from '@/ducks/feature';
import { useSelector } from '@/hooks';

import type { ManagersMap } from '../constants';
import { MANAGERS_BY_FEATURE, MANAGERS_BY_TYPE } from '../constants';

export const getManager = <T extends BlockType>(
  type: T,
  isOverridesEnabled?: boolean | null
): T extends keyof ManagersMap ? ManagersMap[T] : ManagersMap[BlockType.DEPRECATED] => {
  const manager = ((Utils.object.hasProperty(MANAGERS_BY_TYPE, type) && MANAGERS_BY_TYPE[type]) ||
    MANAGERS_BY_TYPE[BlockType.DEPRECATED]) as T extends keyof ManagersMap
    ? ManagersMap[T]
    : ManagersMap[BlockType.DEPRECATED];

  if (isOverridesEnabled && manager?.featureFlagOverrides) {
    return {
      ...manager,
      ...manager.featureFlagOverrides,
    };
  }

  return manager;
};

export const useManager = () => {
  const featureFlags = useSelector(Feature.allActiveFeaturesSelector);

  return React.useCallback(
    <T extends BlockType>(nodeType: T) => {
      const nodeFF = MANAGERS_BY_FEATURE[nodeType];

      return getManager(nodeType, nodeFF && featureFlags[nodeFF as Realtime.FeatureFlag]?.isEnabled);
    },
    [featureFlags]
  );
};
