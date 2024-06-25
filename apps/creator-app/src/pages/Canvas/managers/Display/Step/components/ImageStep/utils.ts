import { BaseNode } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';

import { DEVICE_LABEL_MAP } from '@/constants';

export const getLabel = (data: Realtime.NodeData.Visual): string => {
  if (data.visualType === BaseNode.Visual.VisualType.APL) {
    return data.title ?? 'APL Mockup';
  }

  let label = '';

  if (!data.image) {
    return label;
  }

  if (data.device) {
    label = DEVICE_LABEL_MAP[data.device];
  } else if (data.dimensions) {
    label = data.frameType === BaseNode.Visual.FrameType.CUSTOM_SIZE ? 'Custom Size' : 'Auto Fit';
  }
  return label || '';
};
