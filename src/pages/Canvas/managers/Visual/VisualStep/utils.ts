import { DEVICE_LABEL_MAP } from '@/constants';
import { NodeData } from '@/models';

// eslint-disable-next-line import/prefer-default-export
export const getLabel = ({ image, device, dimensions }: NodeData.Visual) => {
  let label = '';

  if (!image) {
    return label;
  }

  if (device) {
    label = DEVICE_LABEL_MAP[device];
  } else if (dimensions) {
    label = 'Visual';
  }

  return label ? `${label} Mockup` : '';
};
