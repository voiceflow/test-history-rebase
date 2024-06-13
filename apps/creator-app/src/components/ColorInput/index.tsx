import { hexToRGBA, Input, isHexColor, removeHashFromHex, rgbaToHex, useDebouncedCallback, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import { RGBColor } from 'react-color';

import { InputAction } from '@/components/ColorPicker/components';
import ColorSelect from '@/components/ColorSelect';
import { ClassName } from '@/styles/constants';

const getHexColor = (color: RGBColor) => {
  const rgbaColor = { a: 1, ...color };
  const hex = rgbaToHex(rgbaColor);

  return hex.slice(0, hex.length - 2);
};

const getRGBAWithFallback = (hex: string) => {
  try {
    return hexToRGBA(hex);
  } catch {
    return { r: 255, g: 255, b: 255, a: 1 };
  }
};

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
  disabledBorderColor?: string;
}

const ColorInput: React.FC<ColorInputProps> = ({ disabledBorderColor, value, onChange }) => {
  const [localHex, setLocalHex] = React.useState(removeHashFromHex(value));
  const [isDisabled, setIsDisabled] = React.useState(false);

  const debouncedOnChange = useDebouncedCallback(200, onChange, [localHex]);

  useDidUpdateEffect(() => {
    const hashedHex = `#${localHex}`;

    if (isHexColor(hashedHex) && hashedHex.length === 7) {
      debouncedOnChange(hashedHex);
    }
  }, [localHex]);

  const updateLocalHex = (nextHex: string) => setLocalHex(removeHashFromHex(nextHex).toUpperCase());

  return (
    <Input
      className={ClassName.COLOR_INPUT}
      value={localHex}
      cursor={!isDisabled ? 'auto' : 'not-allowed'}
      leftAction={<InputAction>HEX</InputAction>}
      rightAction={
        <ColorSelect
          color={getRGBAWithFallback(`#${localHex}`)}
          onChange={(nextColor: RGBColor) => updateLocalHex(getHexColor(nextColor))}
          alphaSlider={false}
          colors={false}
          hexInput
          onShow={() => setIsDisabled(true)}
          onClose={() => setIsDisabled(false)}
        />
      }
      disabled={isDisabled}
      onChangeText={(value) => {
        setLocalHex(removeHashFromHex(value).substring(0, 6).toUpperCase());
      }}
      wrapperProps={{ disabledBorderColor }}
    />
  );
};

export default ColorInput;
