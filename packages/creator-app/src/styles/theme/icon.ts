import { IconVariant } from '@/constants';

import { COLOR_BLUE, COLOR_WHITE } from './constants';

const PRIMARY_COLOR = '#6E849A';
const SECONDARY_COLOR = '#787878';
const TERTIARY_COLOR = '#BECEDC';

const ICON_THEME = {
  [IconVariant.STANDARD]: {
    color: PRIMARY_COLOR,
    hoverColor: PRIMARY_COLOR,
    activeColor: null,
  },
  [IconVariant.POPOVER]: {
    color: PRIMARY_COLOR,
    hoverColor: PRIMARY_COLOR,
    activeColor: COLOR_BLUE,
  },
  [IconVariant.SECONDARY]: {
    color: SECONDARY_COLOR,
    hoverColor: SECONDARY_COLOR,
    activeColor: null,
  },
  [IconVariant.TERTIARY]: {
    color: TERTIARY_COLOR,
    hoverColor: TERTIARY_COLOR,
    activeColor: TERTIARY_COLOR,
  },
  [IconVariant.BLUE]: {
    color: COLOR_BLUE,
    hoverColor: null,
    activeColor: null,
  },
  [IconVariant.WHITE]: {
    color: COLOR_WHITE,
    hoverColor: null,
    activeColor: null,
  },
} as const;

export default ICON_THEME;
