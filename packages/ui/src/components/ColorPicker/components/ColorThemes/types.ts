import { BaseModels } from '@voiceflow/base-types';

import { Colors, IColor } from '../../constants';

export interface ColorThemesPersistAPI {
  addCustomTheme?: (theme: BaseModels.Project.Theme) => void;
  removeCustomTheme?: (theme: BaseModels.Project.Theme) => void;
  editCustomTheme?: (theme: BaseModels.Project.Theme) => void;
}

export interface ColorThemesProps extends ColorThemesPersistAPI {
  colors: Colors;
  small?: boolean;
  selectedColor?: string;
  onColorSelect: (color: string) => void;
}

export interface BaseColorProps {
  background: string;
  colorData?: IColor;
  selected?: boolean;
  small?: boolean;
}

export interface ColorProps extends BaseColorProps, ColorThemesPersistAPI {
  onClick: () => void;
  selected?: boolean;
  name?: string;
}
