import React from 'react';

import { styled } from '@/hocs';

import Slider from '.';

const Container = styled.div`
  padding: 10px;
  width: 300px;
`;

export default {
  title: 'Slider',
  component: Slider,
};

export const normal = () => {
  const [value, setValue] = React.useState(0);
  return (
    <Container>
      <Slider onChange={setValue} value={value} />
      Value: {value}
    </Container>
  );
};
