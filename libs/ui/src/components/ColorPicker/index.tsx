import type { BaseModels } from '@voiceflow/base-types';
import React from 'react';
import { DismissableLayerProvider } from 'react-dismissable-layers';

import Box from '@/components/Box';
import Tag from '@/components/Tag';
import { useDebouncedCallback, useLinkedState } from '@/hooks';
import { stopPropagation } from '@/utils';
import { createShadesFromHue, createStandardShadeFromHue, STANDARD_GRADE } from '@/utils/colors/hsl';

import { ColorRange } from './components/ColorRange';
import { ColorThemes } from './components/ColorThemes';
import type { ColorThemesPersistAPI } from './components/ColorThemes/types';
import type { Colors, IColor } from './constants';
import { ColorScheme, DEFAULT_SCHEME_COLORS, DEFAULT_THEMES } from './constants';
import { useNormalizedColor } from './hooks';
import { Label, PopperContent, Wrapper } from './styles';
import { hexToHue, normalizeColor } from './utils';

export interface ColorPickerProps extends ColorThemesPersistAPI {
  tagName?: string;
  onChange: (color: string) => void;
  customThemes?: Colors;
  debounceTime?: number;
  selectedColor?: string;
  defaultColorScheme?: ColorScheme;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  tagName = '',
  onChange,
  customThemes = [],
  selectedColor,
  addCustomTheme,
  defaultColorScheme = ColorScheme.DARK,
  debounceTime = 100,
  ...props
}) => {
  const normalizedColor = React.useMemo(
    () => normalizeColor(selectedColor || DEFAULT_SCHEME_COLORS[defaultColorScheme].standardColor),
    [selectedColor, defaultColorScheme]
  );

  const [selectedHex, setSelectedHex] = useLinkedState(normalizedColor);

  const [newColor, setNewColor] = React.useState<IColor | null>(null);

  const debouncedOnChange = useDebouncedCallback(debounceTime, (color: string) => onChange(color), []);

  const onChangeHex = (hex: string) => {
    setSelectedHex(hex);
    debouncedOnChange(hex);
  };

  const onSaveHue = (hue: string) => {
    const palette = createShadesFromHue(hue);

    // do not save standard color
    if (colors.some(({ standardColor }) => standardColor === palette[STANDARD_GRADE])) return;

    setNewColor({ palette, standardColor: palette[STANDARD_GRADE] });
  };

  const onAddCustomTheme = (theme: BaseModels.Project.Theme) => {
    addCustomTheme?.(theme);
    setNewColor(null);
  };

  const localHue = React.useMemo(() => String(hexToHue(selectedHex)), [selectedHex]);

  const colors = [DEFAULT_SCHEME_COLORS[defaultColorScheme], ...DEFAULT_THEMES, ...customThemes];

  return (
    <DismissableLayerProvider>
      <Wrapper>
        <PopperContent onClick={stopPropagation(null, true)}>
          {tagName.trim() && (
            <Box mb={15}>
              <Tag color={selectedHex}>{`{${tagName}}`}</Tag>
            </Box>
          )}

          <Box width={200} mb={22} mt={5}>
            <ColorRange
              hue={localHue}
              setHue={(hue) => onChangeHex(createStandardShadeFromHue(hue))}
              saveHue={onSaveHue}
            />
          </Box>

          <Label>Color themes</Label>
          <ColorThemes
            {...props}
            colors={newColor ? [...colors, newColor] : colors}
            selectedColor={selectedHex}
            newColorIndex={newColor ? colors.length : undefined}
            onColorSelect={onChangeHex}
            addCustomTheme={onAddCustomTheme}
          />
        </PopperContent>
      </Wrapper>
    </DismissableLayerProvider>
  );
};

export default Object.assign(ColorPicker, {
  useNormalizedColor,
});
