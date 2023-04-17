import { StepLabelVariant } from '@/constants/canvas';

import { COLOR_BLUE } from './constants';

const BLOCK_STEP_THEME = {
  minHeight: 54,
  labelText: {
    variants: {
      [StepLabelVariant.PRIMARY]: '#132144',
      [StepLabelVariant.SECONDARY]: '#62778c',
      [StepLabelVariant.PLACEHOLDER]: '#8da2b5',
    },
  },
  activeBorderColor: COLOR_BLUE,
} as const;

export default BLOCK_STEP_THEME;
