import { hexToRGBA, Input, removeHashFromHex, rgbaToHex } from '@voiceflow/ui';
import React from 'react';
import { RGBColor } from 'react-color';

import { InputAction } from '@/components/ColorPicker/components';
import ColorSelect from '@/components/ColorSelect';
import * as Prototype from '@/ducks/prototype';
import { useDispatch, useLinkedState, useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';

const getHexColor = (color: RGBColor) => {
  const rgbaColor = { a: 1, ...color };
  const hex = rgbaToHex(rgbaColor);

  return hex.slice(0, hex.length - 2);
};

interface ColorInputProps {
  isAllowed: boolean;
  disabledBorderColor: string;
}

const ColorInput: React.FC<ColorInputProps> = ({ isAllowed, disabledBorderColor }) => {
  const brandColor = useSelector(Prototype.prototypeBrandColorSelector);
  const updateSettings = useDispatch(Prototype.updateSharePrototypeSettings);

  const [storeHex, storeRGBA] = React.useMemo(() => [removeHashFromHex(brandColor), hexToRGBA(brandColor)], [brandColor]);

  const [hex, setHex] = useLinkedState(storeHex);
  const [color, setColor] = useLinkedState(storeRGBA);

  const onSubmitHexColor = () => {
    const upperCaseHex = hex.toUpperCase();

    try {
      setColor(hexToRGBA(`#${hex}`));
      setHex(upperCaseHex);
      updateSettings({ brandColor: `#${upperCaseHex}` });
    } catch {
      setHex(removeHashFromHex(getHexColor(color)).toUpperCase());
    }
  };

  const onSubmitColor = (nextColor: RGBColor) => {
    const nextHex = removeHashFromHex(getHexColor(nextColor)).toUpperCase();

    setHex(nextHex);
    setColor({ a: 1, ...nextColor });
    updateSettings({ brandColor: `#${nextHex}` });
  };

  return (
    <Input
      id={Identifier.BRANDING_COLOR_INPUT}
      value={hex}
      onBlur={onSubmitHexColor}
      cursor={isAllowed ? 'auto' : 'not-allowed'}
      leftAction={<InputAction>HEX</InputAction>}
      rightAction={
        <ColorSelect
          color={color}
          hexInput={false}
          disabled={!isAllowed}
          onChange={(nextColor: RGBColor) => onSubmitColor(nextColor)}
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
