import { parseToRgb, rgba } from 'polished';
import { RgbaColor } from 'polished/lib/types/color';
import React from 'react';
import { ColorChangeHandler } from 'react-color';
import { ExportedColorProps } from 'react-color/lib/components/common/ColorWrap';

type ExportedProps = {
  opacity: number;
  hexColor: string;
  onChange: (hexColor: string, opacity: number) => void;
};

const getRGBa = (hexColor: string, opacity: number) => {
  const { red: r, green: g, blue: b, alpha: a = 1 } = parseToRgb(rgba(hexColor, opacity)) as RgbaColor;

  return { r, g, b, a };
};

// eslint-disable-next-line react/display-name
const withHexColor = (Component: React.ComponentClass<ExportedColorProps>) => ({ hexColor, opacity, onChange }: ExportedProps) => {
  const [rgba, setRGBa] = React.useState(() => getRGBa(hexColor, opacity));

  const onLocalChange = React.useCallback<ColorChangeHandler>(({ rgb }) => setRGBa({ ...rgb, a: rgb.a ?? 1 }), []);
  const onChangeComplete = React.useCallback<ColorChangeHandler>(({ hex, rgb }) => onChange(hex, rgb.a ?? 1), [onChange]);

  React.useEffect(() => {
    setRGBa(getRGBa(hexColor, opacity));
  }, [hexColor, opacity]);

  return <Component color={rgba} onChange={onLocalChange} onChangeComplete={onChangeComplete} />;
};

export default withHexColor;
