export interface IEntityTypeColorSection {
  pb: number;
  pt?: number;
  name: string;
  type: string | null;
  color: string;
  typeError?: string | null;
  onTypeChange: (value: string) => void;
  onColorChange: (value: string) => void;
}
