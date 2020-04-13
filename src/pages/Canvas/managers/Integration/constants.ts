/* eslint-disable import/prefer-default-export */
import { Icon } from '@/components/SvgIcon';
import { IntegrationType } from '@/constants';

export const ICON_COLOR: Record<IntegrationType, string> = {
  [IntegrationType.CUSTOM_API]: '#74a4bf',
  [IntegrationType.GOOGLE_SHEETS]: '#279745',
  [IntegrationType.ZAPIER]: '#e26d5a',
};

export const ICON: Record<IntegrationType, Icon> = {
  [IntegrationType.CUSTOM_API]: 'variable',
  [IntegrationType.GOOGLE_SHEETS]: 'googleSheets',
  [IntegrationType.ZAPIER]: 'zapier',
};
