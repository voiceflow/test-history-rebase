import { COLOR_PICKER_CONSTANTS, Input, isHexColor, removeHashFromHex } from '@voiceflow/ui';
import { parseToRgb, rgba } from 'polished';
import React from 'react';
import { RGBColor } from 'react-color';
import Alpha from 'react-color/lib/components/common/Alpha';
import ColorWrap, { InjectedColorProps } from 'react-color/lib/components/common/ColorWrap';
import Hue from 'react-color/lib/components/common/Hue';
import Saturation from 'react-color/lib/components/common/Saturation';

import { AlphaContainer, Colors, Container, HueContainer, InputAction, InputContainer, PickerPointer, SaturationContainer } from './components';
import withHexColor from './withHexColor';

export interface ColorPickerProps {
  width?: number;
  colors?: boolean;
  hexInput?: boolean;
  alphaSlider?: boolean;
  colorScheme?: COLOR_PICKER_CONSTANTS.ColorScheme;
  onInputBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onInputFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChangeCompleted?: (color: RGBColor) => void;
  onContainerMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const ColorPicker = ({
  colors = true,
  hexInput = true,
  alphaSlider = true,
  colorScheme = COLOR_PICKER_CONSTANTS.ColorScheme.LIGHT,
  onInputBlur,
  onInputFocus,
  onChangeCompleted,
  onContainerMouseDown,
  ...props
}: ColorPickerProps & InjectedColorProps) => {
  const [localHex, setLocalHex] = React.useState(() => removeHashFromHex(props.hex!));

  const onSubmitHexColor = (hex: string, { completed }: { completed?: boolean } = {}) => {
    let color: string;

    try {
      color = rgba(hex, props.rgb!.a ?? 1);
    } catch {
      color = props.hex!;
      setLocalHex(removeHashFromHex(props.hex!));
    }

    if (completed) {
      const rgba = parseToRgb(color);

      onChangeCompleted?.({
        r: rgba.red,
        g: rgba.green,
        b: rgba.blue,
        a: ('alpha' in rgba && rgba.alpha) || 1,
      });
    } else {
      props.onChange?.(color);
    }
  };

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onSubmitHexColor(`#${localHex}`, { completed: true });
    onInputBlur?.(event);
  };

  const onEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.currentTarget?.blur();
  };

  const onSelectColor = (color: string) => {
    setLocalHex(removeHashFromHex(color));
    onSubmitHexColor(color);
  };

  const onChangeText = (value: string) => {
    const hashedHex = `#${value}`;
    setLocalHex(removeHashFromHex(value).substr(0, 6));

    if (isHexColor(hashedHex) && hashedHex.length === 7) {
      onSubmitHexColor(hashedHex);
    }
  };

  React.useEffect(() => {
    setLocalHex(removeHashFromHex(props.hex!));
  }, [props.hex]);

  return !props.onChange ? null : (
    <Container width={props.width} onMouseDown={onContainerMouseDown}>
      <SaturationContainer>
        <Saturation onChange={props.onChange} {...props} />
      </SaturationContainer>

      <HueContainer>
        <Hue onChange={props.onChange} pointer={PickerPointer} {...props} />
      </HueContainer>

      {alphaSlider && (
        <AlphaContainer>
          <Alpha onChange={props.onChange} pointer={PickerPointer} {...props} />
        </AlphaContainer>
      )}

      {hexInput && (
        <InputContainer>
          <Input
            value={localHex}
            onBlur={onBlur}
            onFocus={onInputFocus}
            leftAction={<InputAction>HEX</InputAction>}
            onEnterPress={onEnterPress}
            onChangeText={onChangeText}
          />
        </InputContainer>
      )}

      {colors && <Colors selectedColor={localHex} colorScheme={colorScheme} onSelect={onSelectColor} />}
    </Container>
  );
};

export default withHexColor(ColorWrap(ColorPicker));
