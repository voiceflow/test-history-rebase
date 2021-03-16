import React from 'react';
import { ColorChangeHandler, RGBColor } from 'react-color';
import { ExportedColorProps } from 'react-color/lib/components/common/ColorWrap';

import { ColorPickerProps } from '.';

type ExportedProps = ColorPickerProps & {
  color: Required<RGBColor>;
  onChange: (color: Required<RGBColor>) => void;
};

// eslint-disable-next-line react/display-name
const withHexColor = (Component: React.ComponentClass<ExportedColorProps>) => ({ color, onChange, ...props }: ExportedProps) => {
  const [rgba, setRGBa] = React.useState(color);

  const onLocalChange = React.useCallback<ColorChangeHandler>(({ rgb }) => setRGBa({ ...rgb, a: rgb.a ?? 1 }), []);
  const onChangeComplete = React.useCallback<ColorChangeHandler>(({ rgb }) => onChange({ ...rgb, a: rgb.a ?? 1 }), [onChange]);

  React.useEffect(() => {
    setRGBa(color);
  }, [color]);

  return <Component color={rgba} onChange={onLocalChange} onChangeComplete={onChangeComplete} {...props} />;
};

export default withHexColor;
