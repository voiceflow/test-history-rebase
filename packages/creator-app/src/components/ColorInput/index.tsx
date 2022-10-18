import { hexToRGBA, Input, removeHashFromHex, rgbaToHex } from '@voiceflow/ui';
import React from 'react';
import { RGBColor } from 'react-color';

import { InputAction } from '@/components/ColorPicker/components';
import ColorSelect from '@/components/ColorSelect';
import { useLinkedState } from '@/hooks';
import { ClassName } from '@/styles/constants';

const getHexColor = (color: RGBColor) => {
  const rgbaColor = { a: 1, ...color };
  const hex = rgbaToHex(rgbaColor);

  return hex.slice(0, hex.length - 2);
};

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
  isAllowed?: boolean;
  disabledBorderColor?: string;
}

const ColorInput: React.FC<ColorInputProps> = ({ isAllowed = true, disabledBorderColor, value, onChange }) => {
  const [storeHex, storeRGBA] = React.useMemo(() => [removeHashFromHex(value), hexToRGBA(value)], [value]);

  const [hex, setHex] = useLinkedState(storeHex);
  const [color, setColor] = useLinkedState(storeRGBA);

  const onSubmitHexColor = () => {
    const upperCaseHex = hex.toUpperCase();

    try {
      setColor(hexToRGBA(`#${hex}`));
      setHex(upperCaseHex);
      onChange(`#${upperCaseHex}`);
    } catch {
      setHex(removeHashFromHex(getHexColor(color)).toUpperCase());
    }
  };

  const updateRGBColor = (nextColor: RGBColor) => {
    const nextHex = removeHashFromHex(getHexColor(nextColor)).toUpperCase();

    setHex(nextHex);
    setColor({ a: 1, ...nextColor });
  };

  return (
    <Input
      className={ClassName.COLOR_INPUT}
      value={hex}
      onBlur={onSubmitHexColor}
      cursor={isAllowed ? 'auto' : 'not-allowed'}
      leftAction={<InputAction>HEX</InputAction>}
      rightAction={
        <ColorSelect
          color={color}
          hexInput={false}
          disabled={!isAllowed}
          onChange={(nextColor: RGBColor) => updateRGBColor(nextColor)}
          alphaSlider={false}
        />
      }
      disabled={!isAllowed}
      onEnterPress={onSubmitHexColor}
      onChangeText={(value) => setHex(removeHashFromHex(value).substring(0, 6))}
      wrapperProps={{ disabledBorderColor }}
    />
  );
};

export default ColorInput;
