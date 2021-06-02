import React from 'react';
import { ColorChangeHandler, RGBColor } from 'react-color';
import { ExportedColorProps } from 'react-color/lib/components/common/ColorWrap';

import { ColorPickerProps } from '.';

type ExportedProps = ColorPickerProps & {
  color: Required<RGBColor>;
  onChange: (color: Required<RGBColor>) => void;
};

const withHexColor =
  <P extends object>(Component: React.ComponentClass<P & ExportedColorProps>) =>
  ({ color, onChange, ...props }: P & ExportedProps) => {
    const [rgba, setRGBa] = React.useState(color);

    const onLocalChange = React.useCallback<ColorChangeHandler>(({ rgb }) => setRGBa({ ...rgb, a: rgb.a ?? 1 }), []);
    const onChangeComplete = React.useCallback<ColorChangeHandler>(({ rgb }) => onChange({ ...rgb, a: rgb.a ?? 1 }), [onChange]);
    const onChangeCompleted = React.useCallback(
      (rgb: RGBColor) => {
        setRGBa({ ...rgb, a: rgb.a ?? 1 });
        onChange({ ...rgb, a: rgb.a ?? 1 });
      },
      [onChange]
    );

    React.useEffect(() => {
      setRGBa(color);
    }, [color]);

    return (
      <Component
        {...(props as any)}
        color={rgba}
        onChange={onLocalChange}
        onChangeComplete={onChangeComplete}
        onChangeCompleted={onChangeCompleted}
      />
    );
  };

export default withHexColor;
