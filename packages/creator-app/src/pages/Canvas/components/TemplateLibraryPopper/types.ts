import { COLOR_PICKER_CONSTANTS } from '@voiceflow/ui';

export interface TemplatePopperContentProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  defaultColorScheme?: COLOR_PICKER_CONSTANTS.ColorScheme;
  nodeIDs: string[];
  editing?: boolean;
  onNameChange?: (name: string) => void;
  oldName?: string;
}
