/* eslint-disable @typescript-eslint/no-namespace */
import type { Level as LevelType } from './constants';

export namespace StrengthGaugeTypes {
  export type Level = LevelType;

  export interface Props {
    level: Level;
    width?: number;
    thickness?: number;
    tooltipLabelMap?: Partial<Record<Level, string>>;
  }
}
