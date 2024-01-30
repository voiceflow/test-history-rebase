import { Box, ColorPickerForm } from '@voiceflow/ui-next';
import React from 'react';

import { Project } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { uiCustomThemeAdapter } from '@/utils/custom-theme.util';

import type { IVariableColorPicker } from './VariableColorPicker.interface';

export const VariableColorPicker: React.FC<IVariableColorPicker> = ({ value, disabled, onValueChange }) => {
  const colors = useSelector(Project.active.customThemesSelector);

  const onAddCustomTheme = useDispatch(Project.addCustomThemeToProject);
  const onDeleteCustomTheme = useDispatch(Project.removeCustomThemeOnProject);
  const onUpdateCustomTheme = useDispatch(Project.editCustomThemeOnProject);

  const customThemes = React.useMemo(() => uiCustomThemeAdapter.mapFromDB(colors), [colors]);

  return (
    <Box direction="column" justify="start" align="end" alignSelf="baseline" overflow="hidden">
      <ColorPickerForm
        onChange={onValueChange}
        isDisabled={disabled}
        customThemes={customThemes}
        selectedColor={value}
        onAddCustomTheme={(theme) => onAddCustomTheme(uiCustomThemeAdapter.toDB(theme))}
        onDeleteCustomTheme={(theme) => onDeleteCustomTheme(uiCustomThemeAdapter.toDB(theme))}
        onUpdateCustomTheme={(theme) => onUpdateCustomTheme(uiCustomThemeAdapter.toDB(theme))}
      />
    </Box>
  );
};
