import { Colors, IColor } from '../../constants';

export interface ColorThemesProps {
  colors: Colors;
  small?: boolean;
  selectedColor?: IColor;
  onColorSelect: (color: IColor) => void;
}

export interface BaseColorProps {
  background: string;
  colorData?: IColor;
  small?: boolean;
}

export interface ColorProps extends BaseColorProps {
  onClick: () => void;
  selected?: boolean;
  name?: string;
}
