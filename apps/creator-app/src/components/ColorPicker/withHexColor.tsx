import React from 'react';
import type { ColorChangeHandler, RGBColor } from 'react-color';
import type { ExportedColorProps } from 'react-color/lib/components/common/ColorWrap';

import type { ColorPickerProps } from './index';

interface ExportedProps extends ColorPickerProps {
  color: Required<RGBColor>;
  onChange: (color: Required<RGBColor>) => void;
}

const withHexColor =
  <P extends object>(Component: React.ComponentClass<P & ExportedColorProps>) =>
  ({ color, onChange, ...props }: P & ExportedProps) => {
    const [rgba, setRGBa] = React.useState(color);

    const onLocalChange = React.useCallback<ColorChangeHandler>(({ rgb }) => setRGBa({ ...rgb, a: rgb.a ?? 1 }), []);
    const onChangeComplete = React.useCallback<ColorChangeHandler>(
      ({ rgb }) => onChange({ ...rgb, a: rgb.a ?? 1 }),
      [onChange]
    );
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
        {...(props as P)}
        color={rgba}
        onChange={onLocalChange}
        onChangeComplete={onChangeComplete}
        onChangeCompleted={onChangeCompleted}
      />
    );
  };

export default withHexColor;
