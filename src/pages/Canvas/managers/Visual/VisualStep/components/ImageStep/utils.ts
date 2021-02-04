import { VisualType } from '@voiceflow/general-types/build/nodes/visual';

import { DEVICE_LABEL_MAP } from '@/constants';
import { NodeData } from '@/models';

// eslint-disable-next-line import/prefer-default-export
export const getLabel = (data: NodeData.Visual): string => {
  if (data.visualType === VisualType.APL) {
    return data.title ?? 'APL Mockup';
  }

  let label = '';

  if (!data.image) {
    return label;
  }

  if (data.device) {
    label = DEVICE_LABEL_MAP[data.device];
  } else if (data.dimensions) {
    label = 'Visual';
  }

  return label ? `${label} Mockup` : '';
};
