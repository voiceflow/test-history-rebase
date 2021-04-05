import React from 'react';
import { RGBColor } from 'react-color';

import { InputAction } from '@/components/ColorPicker/components';
import ColorSelect from '@/components/ColorSelect';
import Input from '@/components/Input';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';
import { hexToRGBA, removeHash, rgbaToHex } from '@/utils/colors';
import { withEnterPress } from '@/utils/dom';

const getHexColor = (color: RGBColor) => {
  const rgbaColor = { a: 1, ...color };
  const hex = rgbaToHex(rgbaColor);
  return hex.slice(0, hex.length - 2);
};

type ColorInputProps = {
  isAllowed: boolean;
  disabledBorderColor: string;
};

const ColorInput: React.FC<ColorInputProps & ConnectedColorInputProps> = ({ isAllowed, disabledBorderColor, brandColor, updateSettings }) => {
  const [hex, setHex] = React.useState(() => removeHash(brandColor));
  const [color, setColor] = React.useState(() => hexToRGBA(brandColor));

  const onSubmitHexColor = () => {
    const upperCaseHex = hex.toUpperCase();

    try {
      setColor(hexToRGBA(`#${hex}`));
      setHex(upperCaseHex);
      updateSettings({ brandColor: `#${upperCaseHex}` });
    } catch {
      setHex(removeHash(getHexColor(color)).toUpperCase());
    }
  };

  const onSubmitColor = (nextColor: RGBColor) => {
    const nextHex = removeHash(getHexColor(nextColor)).toUpperCase();

    setHex(nextHex);
    setColor({ a: 1, ...nextColor });
    updateSettings({ brandColor: `#${nextHex}` });
  };

  return (
    <Input
      value={hex}
      onBlur={() => onSubmitHexColor()}
      onChange={({ currentTarget }) => setHex(currentTarget.value)}
      leftAction={<InputAction>HEX</InputAction>}
      rightAction={<ColorSelect alphaSlider={false} hexInput={false} color={color} onChange={(nextColor: RGBColor) => onSubmitColor(nextColor)} />}
      maxLength={6}
      onKeyPress={withEnterPress(() => onSubmitHexColor())}
      disabled={!isAllowed}
      wrapperProps={{ disabledBorderColor }}
    />
  );
};

const mapStateToProps = {
  brandColor: Prototype.prototypeBrandColorSelector,
};

const mapDispatchProps = {
  updateSettings: Prototype.updateSharePrototypeSettings,
};

type ConnectedColorInputProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchProps>;

export default connect(mapStateToProps, mapDispatchProps)(ColorInput) as React.FC<ColorInputProps>;
