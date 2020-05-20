import { rgba } from 'polished';
import React from 'react';
import { RGBColor } from 'react-color';
import Alpha from 'react-color/lib/components/common/Alpha';
import ColorWrap, { InjectedColorProps } from 'react-color/lib/components/common/ColorWrap';
import Hue from 'react-color/lib/components/common/Hue';
import Saturation from 'react-color/lib/components/common/Saturation';

import Input from '@/components/Input';
import { withEnterPress } from '@/utils/dom';

import { AlphaContainer, Colors, Container, HueContainer, InputAction, InputContainer, PickerPointer, SaturationContainer } from './components';
import withHexColor from './withHexColor';

export type Color = Required<RGBColor>;

const removeHash = (hex: string) => hex.substr(1);

const ColorPicker = (props: InjectedColorProps) => {
  const [localHex, setLocalHex] = React.useState(() => removeHash(props.hex!));

  const onSubmitHexColor = (hex: string) => {
    let color: string | RGBColor;

    try {
      color = rgba(hex, props.rgb!.a ?? 1);
    } catch {
      color = props.rgb!;
      setLocalHex(removeHash(props.hex!));
    }

    props.onChange?.(color);
  };

  React.useEffect(() => {
    setLocalHex(removeHash(props.hex!));
  }, [props.hex]);

  return !props.onChange ? null : (
    <Container>
      <SaturationContainer>
        <Saturation onChange={props.onChange} {...props} />
      </SaturationContainer>

      <HueContainer>
        <Hue onChange={props.onChange} pointer={() => <PickerPointer />} {...props} />
      </HueContainer>

      <AlphaContainer>
        <Alpha onChange={props.onChange} pointer={() => <PickerPointer />} {...props} />
      </AlphaContainer>

      <InputContainer>
        <Input
          value={localHex}
          onBlur={() => onSubmitHexColor(`#${localHex}`)}
          onChange={({ currentTarget }) => setLocalHex(currentTarget.value)}
          leftAction={<InputAction>HEX</InputAction>}
          maxLength={6}
          onKeyPress={withEnterPress(() => onSubmitHexColor(`#${localHex}`))}
        />
      </InputContainer>

      <Colors
        onSelect={(color: string) => {
          setLocalHex(removeHash(color));
          onSubmitHexColor(color);
        }}
      />
    </Container>
  );
};

export default withHexColor(ColorWrap(ColorPicker));
