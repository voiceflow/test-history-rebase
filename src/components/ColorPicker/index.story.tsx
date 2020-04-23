import React from 'react';

import ColorPicker from '.';

export default {
  title: 'Color Picker',
  component: ColorPicker,
};

export const base = () => {
  const [opacity, setOpacity] = React.useState(0.7);
  const [hexColor, setHexColor] = React.useState('#9a3');

  return (
    <div style={{ margin: '20px' }}>
      <div style={{ backgroundColor: hexColor, opacity, width: '50px', height: '50px', borderRadius: '50px' }}></div>
      <ColorPicker
        hexColor={hexColor}
        opacity={opacity}
        onChange={(color: string, alpha: number) => {
          setOpacity(alpha);
          setHexColor(color);
        }}
      />
    </div>
  );
};
