import type { Level as LevelType } from './constants';

export type Level = LevelType;

export interface Props {
  level?: Level;
  width?: number;
  tooltipLabelMap?: Partial<Record<Level, string>>;
}
