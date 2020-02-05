import React from 'react';

import Tabs from '.';

const OPTIONS = [
  { value: '1', label: 'First value' },
  { value: '2', label: 'second value' },
  { value: '3', label: 'third long long long long value' },
];

export default {
  title: 'Tabs',
  component: Tabs,
  includeStories: [],
};

export const normal = () => {
  const [selected, updateSelected] = React.useState(OPTIONS[0].value);

  return (
    <div style={{ height: 50 }}>
      <Tabs options={OPTIONS} selected={selected} onChange={updateSelected} />
    </div>
  );
};
