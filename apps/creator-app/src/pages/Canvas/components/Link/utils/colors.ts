import { LEGACY_STROKE_DEFAULT_COLOR, STROKE_DEFAULT_COLOR } from '../constants';

export const migrateColor = (legacyColor: string | undefined = STROKE_DEFAULT_COLOR) =>
  legacyColor === LEGACY_STROKE_DEFAULT_COLOR ? STROKE_DEFAULT_COLOR : legacyColor;
