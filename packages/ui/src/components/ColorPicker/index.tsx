/* eslint-disable import/prefer-default-export */
import { useOnClickOutside } from '@ui/hooks/mouse';
import React, { useState } from 'react';

import { ColorPickerPopOver } from './components/ColorPickerPopOver';
import { ColorThemes } from './components/ColorThemes';
import { Color } from './components/ColorThemes/Color';
import { BASE_COLORS, COLOR_WHEEL, Colors, IColor } from './constants';
import { Wrapper } from './styles';

interface ColorPickerProps {
  colors: Colors;
  tagName: string;
  selectedColor: IColor;
  onChange: (color: IColor) => void;
  onSaveColor: (color: IColor) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ colors, selectedColor, onChange, onSaveColor, tagName = 'my_variable' }) => {
  const popOver = React.useRef(null);
  const [isShowingPicker, setIsShowingPicker] = useState(false);
  const isCustomColor = !BASE_COLORS.find(({ hue }) => hue === selectedColor.hue);

  useOnClickOutside(popOver, () => setIsShowingPicker(false), [setIsShowingPicker]);

  return (
    <Wrapper>
      <ColorThemes small selectedColor={selectedColor} onColorSelect={(color: IColor) => onChange(color)} colors={BASE_COLORS} />
      <Color selected={isCustomColor} onClick={() => setIsShowingPicker(true)} small background={COLOR_WHEEL} />
      {isShowingPicker && (
        <ColorPickerPopOver
          ref={popOver}
          colors={colors}
          selectedColor={selectedColor}
          onChange={onChange}
          onSaveColor={onSaveColor}
          tagName={tagName}
        />
      )}
    </Wrapper>
  );
};
