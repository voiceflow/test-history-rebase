import { useDebouncedCallback, useDidUpdateEffect } from '@ui/hooks';
import { useOnClickOutside } from '@ui/hooks/mouse';
import { Utils } from '@voiceflow/common';
import React from 'react';

import { ColorThemes } from './components/ColorThemes';
import { Color } from './components/ColorThemes/Color';
import { ColorPickerPopper } from './components/Poppers/ColorPickerPopper';
import { BASE_COLORS, COLOR_WHEEL, Colors, DEFAULT_COLORS } from './constants';
import { Wrapper } from './styles';
import { isBaseColor, normalizeColor } from './utils';

interface ColorPickerProps {
  customColors?: Colors;
  tagName?: string;
  selectedColor: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, customColors = [], onChange, tagName }) => {
  const trimmedTagName = tagName?.trim() || 'label';
  const colors = [...DEFAULT_COLORS, ...customColors];
  const [selectedHex, setLocalSelectedHex] = React.useState(() => normalizeColor(selectedColor));
  const popOver = React.useRef(null);
  const [isShowingPicker, setIsShowingPicker] = React.useState(false);
  const isCustomColor = React.useMemo(() => !isBaseColor(selectedHex), [selectedHex]);
  const debouncedSetColor = useDebouncedCallback(100, (color: string) => onChange(color), []);

  useDidUpdateEffect(() => {
    setLocalSelectedHex(normalizeColor(selectedColor));
  }, [selectedColor]);

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
          tagName={trimmedTagName}
          onChange={Utils.functional.chain(debouncedSetColor, setLocalSelectedHex)}
          selectedColor={selectedHex}
        />
      )}
    </Wrapper>
  );
};
