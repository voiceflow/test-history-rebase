import { ProjectCustomTheme } from '@voiceflow/dtos';
import { createShadesFromColor } from '@voiceflow/ui';
import { CustomTheme } from '@voiceflow/ui-next/build/esm/components/Other/ColorPicker/ColorPickerForm/ColorPickerForm.interface';
import { createMultiAdapter } from 'bidirectional-adapter';

export const uiCustomThemeAdapter = createMultiAdapter<ProjectCustomTheme, CustomTheme>(
  ({ name, standardColor }) => ({ label: name ?? `Custom (${standardColor})`, color: standardColor }),
  ({ color, label }) => ({ name: label, palette: createShadesFromColor(color), standardColor: color })
);
