import React from 'react';

import { styled } from '@/hocs';

import Item from './Item';

const Container = styled.tr`
  border-bottom: 1px solid rgba(226, 233, 236, 0.63);
`;

function ResultLineItem({ variable }) {
  return (
    <Container>
      <Item value={variable.path} />
      <Item value={variable.value} />
      <Item variable value={variable.var} />
    </Container>
  );
}

export default ResultLineItem;
