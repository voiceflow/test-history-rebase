import type { BaseModels } from '@voiceflow/base-types';

import type { Colors, IColor } from '../../constants';

export interface ColorThemesPersistAPI {
  addCustomTheme?: (theme: BaseModels.Project.Theme) => void;
  editCustomTheme?: (theme: BaseModels.Project.Theme) => void;
  removeCustomTheme?: (theme: BaseModels.Project.Theme) => void;
}

export interface ColorThemesProps extends ColorThemesPersistAPI {
  small?: boolean;
  colors: Colors;
  selectedColor?: string;
  newColorIndex?: number;
  onColorSelect: (color: string) => void;
  disableContextMenu?: boolean;
}

export interface BaseColorProps {
  small?: boolean;
  selected?: boolean;
  colorData?: IColor;
  background: string;
}

export interface ColorProps extends BaseColorProps, ColorThemesPersistAPI {
  name?: string;
  isNew?: boolean;
  onClick: () => void;
  selected?: boolean;
  disableContextMenu?: boolean;
}
