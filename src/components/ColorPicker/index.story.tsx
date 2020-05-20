import React from 'react';

import ColorPicker from '.';

export default {
  title: 'Color Picker',
  component: ColorPicker,
};

export const base = () => {
  const [color, setColor] = React.useState({ r: 150, g: 200, b: 30, a: 0.7 });

  return (
    <div style={{ margin: '20px' }}>
      <div
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50px',
          backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
        }}
      />
      <ColorPicker color={color} onChange={setColor} />
    </div>
  );
};
