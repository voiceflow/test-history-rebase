import { useDebouncedCallback } from '@ui/hooks';
import { useOnClickOutside } from '@ui/hooks/mouse';
import { rgbaToHex } from '@ui/utils';
import { isHexColor } from '@ui/utils/colors/hex';
import { Utils } from '@voiceflow/common';
import { parseToRgb } from 'polished';
import React from 'react';

import { ColorThemes } from './components/ColorThemes';
import { Color } from './components/ColorThemes/Color';
import { ColorPickerPopper } from './components/Poppers/ColorPickerPopper';
import { BASE_COLORS, COLOR_WHEEL, Colors, DEFAULT_COLORS } from './constants';
import { Wrapper } from './styles';
import { isBaseColor } from './utils';

interface ColorPickerProps {
  customColors?: Colors;
  tagName?: string;
  selectedColor: string;
  onChange: (color: string) => void;
}

const normalizeColorToHex = (color: string) => {
  if (isHexColor(color)) return color;

  const { red: r, green: g, blue: b } = parseToRgb(color);

  return rgbaToHex({ r, g, b, a: 1 });
};

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, customColors = [], onChange, tagName }) => {
  const trimmedTagName = tagName?.trim() || 'label';
  const colors = [...DEFAULT_COLORS, ...customColors];
  const [selectedHex, setLocalSelectedHex] = React.useState(() => normalizeColorToHex(selectedColor));

  const popOver = React.useRef(null);
  const [isShowingPicker, setIsShowingPicker] = React.useState(false);
  const isCustomColor = React.useMemo(() => !isBaseColor(selectedHex), [selectedHex]);
  const debouncedSetColor = useDebouncedCallback(100, (color: string) => onChange(color), []);

  useOnClickOutside(popOver, () => setIsShowingPicker(false), [setIsShowingPicker]);
  return (
    <Wrapper>
      <ColorThemes
        small
        selectedColor={selectedHex}
        onColorSelect={(color) => {
          debouncedSetColor(color);
          setLocalSelectedHex(color);
        }}
        colors={BASE_COLORS}
      />
      <Color selected={isCustomColor} onClick={() => setIsShowingPicker(true)} small background={COLOR_WHEEL} />
      {isShowingPicker && (
        <ColorPickerPopper
          ref={popOver}
          colors={colors}
          selectedColor={selectedHex}
          onChange={Utils.functional.chain(debouncedSetColor, setLocalSelectedHex)}
          tagName={trimmedTagName}
        />
      )}
    </Wrapper>
  );
};
