import { parseToRgb, rgba } from 'polished';
import React from 'react';
import { RGBColor } from 'react-color';
import Alpha from 'react-color/lib/components/common/Alpha';
import ColorWrap, { InjectedColorProps } from 'react-color/lib/components/common/ColorWrap';
import Hue from 'react-color/lib/components/common/Hue';
import Saturation from 'react-color/lib/components/common/Saturation';

import Input from '@/components/Input';
import { removeHash } from '@/utils/colors';
import { withEnterPress } from '@/utils/dom';

import { AlphaContainer, Colors, Container, HueContainer, InputAction, InputContainer, PickerPointer, SaturationContainer } from './components';
import withHexColor from './withHexColor';

export type ColorPickerProps = {
  width?: number;
  colors?: boolean;
  hexInput?: boolean;
  alphaSlider?: boolean;
  onInputBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onInputFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChangeCompleted?: (color: RGBColor) => void;
};

const ColorPicker = ({
  colors = true,
  hexInput = true,
  alphaSlider = true,
  onInputBlur,
  onInputFocus,
  onChangeCompleted,
  ...props
}: ColorPickerProps & InjectedColorProps) => {
  const [localHex, setLocalHex] = React.useState(() => removeHash(props.hex!));

  const onSubmitHexColor = (hex: string, { completed }: { completed?: boolean } = {}) => {
    let color: string;

    try {
      color = rgba(hex, props.rgb!.a ?? 1);
    } catch {
      color = props.hex!;
      setLocalHex(removeHash(props.hex!));
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
    setLocalHex(removeHash(color));
    onSubmitHexColor(color);
  };

  React.useEffect(() => {
    setLocalHex(removeHash(props.hex!));
  }, [props.hex]);

  return !props.onChange ? null : (
    <Container width={props.width}>
      <SaturationContainer>
        <Saturation onChange={props.onChange} {...props} />
      </SaturationContainer>

      <HueContainer>
        <Hue onChange={props.onChange} pointer={() => <PickerPointer />} {...props} />
      </HueContainer>

      {alphaSlider && (
        <AlphaContainer>
          <Alpha onChange={props.onChange} pointer={() => <PickerPointer />} {...props} />
        </AlphaContainer>
      )}

      {hexInput && (
        <InputContainer>
          <Input
            value={localHex}
            onBlur={onBlur}
            onFocus={onInputFocus}
            onChange={({ currentTarget: { value } }) => setLocalHex(removeHash(value).substr(0, 6))}
            leftAction={<InputAction>HEX</InputAction>}
            onKeyPress={withEnterPress(onEnterPress)}
          />
        </InputContainer>
      )}

      {colors && <Colors onSelect={onSelectColor} />}
    </Container>
  );
};

export default withHexColor(ColorWrap(ColorPicker));
