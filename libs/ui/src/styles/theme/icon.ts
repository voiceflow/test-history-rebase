import { Variant as SvgIconVariant } from '@ui/components/SvgIcon/constants';
import { COLOR_BLUE, COLOR_WHITE } from '@ui/styles/constants';

const PRIMARY_COLOR = '#6E849A';
const SECONDARY_COLOR = '#787878';
const TERTIARY_COLOR = '#BECEDC';

const ICON_THEME = {
  [SvgIconVariant.STANDARD]: {
    color: PRIMARY_COLOR,
    hoverColor: PRIMARY_COLOR,
    activeColor: null,
  },
  [SvgIconVariant.POPOVER]: {
    color: PRIMARY_COLOR,
    hoverColor: PRIMARY_COLOR,
    activeColor: COLOR_BLUE,
  },
  [SvgIconVariant.SECONDARY]: {
    color: SECONDARY_COLOR,
    hoverColor: SECONDARY_COLOR,
    activeColor: null,
  },
  [SvgIconVariant.TERTIARY]: {
    color: TERTIARY_COLOR,
    hoverColor: TERTIARY_COLOR,
    activeColor: TERTIARY_COLOR,
  },
  [SvgIconVariant.BLUE]: {
    color: COLOR_BLUE,
    hoverColor: null,
    activeColor: null,
  },
  [SvgIconVariant.WHITE]: {
    color: COLOR_WHITE,
    hoverColor: null,
    activeColor: null,
  },
} as const;

export default ICON_THEME;
