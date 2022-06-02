import Box from '@ui/components/Box';
import { Tag } from '@ui/components/Tag';
import { useDebouncedCallback } from '@ui/hooks';
import { stopPropagation } from '@ui/utils';
import { createStandardShadeFromHue } from '@ui/utils/colors/hsl';
import { Utils } from '@voiceflow/common';
import React from 'react';

import { ColorRange } from './components/ColorRange';
import { ColorThemes } from './components/ColorThemes';
import { Colors, DEFAULT_COLORS, DEFAULT_THEMES } from './constants';
import { Label, PopperContent, Wrapper } from './styles';
import { hexToHue, normalizeColor } from './utils';

const { compose, chain } = Utils.functional;

export interface ColorPickerProps {
  defaultColorScheme?: 'light' | 'dark';
  onChange: (color: string) => void;
  selectedColor: string;
  customColors?: Colors;
  tagName?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  defaultColorScheme = 'dark',
  selectedColor,
  customColors = [],
  onChange,
  tagName = '',
}) => {
  const debouncedSetColor = useDebouncedCallback(100, (color: string) => onChange(color), []);
  const [selectedHex, setLocalSelectedHex] = React.useState<string>(() => normalizeColor(selectedColor));
  const [localHue, setLocalHue] = React.useState(() => String(hexToHue(selectedHex)));

  return (
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
            setHue={chain(
              setLocalHue,
              compose(debouncedSetColor, String, createStandardShadeFromHue),
              compose(setLocalSelectedHex, String, createStandardShadeFromHue)
            )}
          />
        </Box>

        <Label>Color themes</Label>
        <ColorThemes
          colors={[DEFAULT_COLORS[defaultColorScheme], ...DEFAULT_THEMES, ...customColors]}
          selectedColor={selectedHex}
          onColorSelect={chain(debouncedSetColor, setLocalSelectedHex, compose(setLocalHue, String, hexToHue))}
        />
      </PopperContent>
    </Wrapper>
  );
};
