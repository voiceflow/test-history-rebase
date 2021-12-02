import React from 'react';

import { VariableTag } from '@/components/VariableTag';
import { styled } from '@/hocs';

const Container = styled.td`
  cursor: default;
  font-size: 13px;
  div {
    width: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Item = ({ value, variable }) => (
  <Container>
    <div>{variable ? <VariableTag>{value}</VariableTag> : <span>{value}</span>}</div>
  </Container>
);

export default Item;
