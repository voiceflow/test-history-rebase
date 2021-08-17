import { Node } from '@voiceflow/base-types';

import { DEVICE_LABEL_MAP } from '@/constants';
import { NodeData } from '@/models';

// eslint-disable-next-line import/prefer-default-export
export const getLabel = (data: NodeData.Visual): string => {
  if (data.visualType === Node.Visual.VisualType.APL) {
    return data.title ?? 'APL Mockup';
  }

  let label = '';

  if (!data.image) {
    return label;
  }

  if (data.device) {
    label = DEVICE_LABEL_MAP[data.device];
  } else if (data.dimensions) {
    label = data.frameType === Node.Visual.FrameType.CUSTOM_SIZE ? 'Custom Size' : 'Auto Fit';
  }
  return label || '';
};
