import React from 'react';
import { Tooltip } from 'react-tippy';

import VariableTag from '@/components/VariableTag';
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

function Item({ value, variable }) {
  return (
    <Container>
      <div>
        <Tooltip html={value}>
          {variable ? (
            <VariableTag>
              {'{'}
              {value}
              {'}'}
            </VariableTag>
          ) : (
            <span>{value}</span>
          )}
        </Tooltip>
      </div>
    </Container>
  );
}

export default Item;
