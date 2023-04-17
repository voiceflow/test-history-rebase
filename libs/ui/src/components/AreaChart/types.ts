export interface AreaChartDatum {
  x: number;
  y: number;
}

export type DatumFormatter = (value: string | number) => string;
export type DatumStyler = (value: string | number) => React.SVGProps<SVGTextElement> | undefined;
export type TickFactory<A extends any[]> = (...args: A) => Array<string | number>;

export interface AreaChartFormatter {
  tooltip: {
    formatX: DatumFormatter;
    formatY?: DatumFormatter;
  };
  axes: {
    formatX: DatumFormatter;
    styleX?: DatumStyler;
    ticksX?: TickFactory<[data: AreaChartDatum[]]>;
    ticksY?: TickFactory<[minY: number, maxY: number]>;
  };
}
