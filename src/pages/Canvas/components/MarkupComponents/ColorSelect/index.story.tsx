import React from 'react';

import ColorSelect from '.';

export default {
  title: 'Creator/Markup Components/Color Select',
  component: ColorSelect,
};

const createStory = () => () => {
  const [color, setColor] = React.useState({ r: 150, g: 200, b: 30, a: 0.7 });

  return <ColorSelect color={color} onChange={setColor} />;
};

export const normal = createStory();
