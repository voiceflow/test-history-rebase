import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockType } from '@/constants';
import * as Feature from '@/ducks/feature';
import { useSelector } from '@/hooks';

import { MANAGERS_BY_FEATURE, MANAGERS_BY_TYPE, ManagersMap } from './constants';

export const getManager = <T extends BlockType>(
  type: T,
  isV2Enabled?: boolean | null
): T extends keyof ManagersMap ? ManagersMap[T] : ManagersMap[BlockType.DEPRECATED] => {
  const manager = ((Utils.object.hasProperty(MANAGERS_BY_TYPE, type) && MANAGERS_BY_TYPE[type]) ||
    MANAGERS_BY_TYPE[BlockType.DEPRECATED]) as T extends keyof ManagersMap ? ManagersMap[T] : ManagersMap[BlockType.DEPRECATED];

  if (isV2Enabled && manager?.v2) {
    return {
      ...manager,
      ...manager.v2,
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

export const getNoMatchNoReplySectionLabel = <E extends { REPROMPT: string; PATH: string }>(Enum: E, types: string[]): string => {
  const names = [];

  if (types.includes(Enum.REPROMPT)) {
    names.push('Reprompt');
  }

  if (types.includes(Enum.PATH)) {
    names.push('Path');
  }

  return names.join(' + ');
};

export const getNoMatchNoReplySectionLabelByType = <E extends { REPROMPT: string; PATH: string; BOTH: string }>(
  Enum: E,
  type: null | string
): string => {
  switch (type) {
    case Enum.PATH:
      return 'Path';
    case Enum.REPROMPT:
      return 'Reprompt';
    case Enum.BOTH:
      return 'Reprompt + Path';
    default:
      return '';
  }
};
