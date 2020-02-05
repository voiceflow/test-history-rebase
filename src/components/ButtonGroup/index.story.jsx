import React from 'react';

import ButtonGroup from '.';

const OPTIONS = [
  {
    value: '1',
    label: 'First Option',
  },
  {
    value: '2',
    label: 'Second Option',
  },
  {
    value: '3',
    label: 'Third Option',
  },
];

const getProps = () => {
  const [selected, updateSelected] = React.useState(OPTIONS[0].value);

  return {
    selected,
    onChange: updateSelected,
  };
};

export default {
  title: 'Button Group',
  component: ButtonGroup,
  includeStories: [],
};

export const normal = () => <ButtonGroup options={OPTIONS} {...getProps()} />;
