export interface ISwitch {
  value: unknown;
  children: React.ReactElement<{ value: unknown }> | React.ReactElement<{ value: unknown }>[];
}
