import { tid } from '@voiceflow/style';
import { Box, ColorPickerForm, Entity } from '@voiceflow/ui-next';
import React from 'react';

import { Project } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { uiCustomThemeAdapter } from '@/utils/custom-theme.util';

import { entityStyles } from './EntityColorPicker.css';
import type { IEntityColorPicker } from './EntityColorPicker.interface';

export const EntityColorPicker: React.FC<IEntityColorPicker> = ({ name, value, disabled, onValueChange }) => {
  const TEST_ID = tid('entity', 'color');

  const colors = useSelector(Project.active.customThemesSelector);

  const onAddCustomTheme = useDispatch(Project.addCustomThemeToProject);
  const onDeleteCustomTheme = useDispatch(Project.removeCustomThemeOnProject);
  const onUpdateCustomTheme = useDispatch(Project.editCustomThemeOnProject);

  const customThemes = React.useMemo(() => uiCustomThemeAdapter.mapFromDB(colors), [colors]);

  return (
    <Box mb={8} gap={15} direction="column" justify="start" align="end" alignSelf="baseline" overflow="hidden">
      <Entity
        label={name}
        color={value}
        className={entityStyles({ isVisible: !!name })}
        testID={tid(TEST_ID, 'preview')}
      />

      <ColorPickerForm
        onChange={onValueChange}
        isDisabled={disabled}
        customThemes={customThemes}
        selectedColor={value}
        onAddCustomTheme={(theme) => onAddCustomTheme(uiCustomThemeAdapter.toDB(theme))}
        onDeleteCustomTheme={(theme) => onDeleteCustomTheme(uiCustomThemeAdapter.toDB(theme))}
        onUpdateCustomTheme={(theme) => onUpdateCustomTheme(uiCustomThemeAdapter.toDB(theme))}
        testID={TEST_ID}
      />
    </Box>
  );
};
