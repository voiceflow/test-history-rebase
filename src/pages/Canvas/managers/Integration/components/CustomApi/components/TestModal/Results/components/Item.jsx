import React from 'react';
import { Tooltip } from 'react-tippy';

import { VariableTag } from '@/componentsV2/VariableTag';
import { styled } from '@/hocs';

const MAX_VAR_LENGTH = 8;

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

const structureVar = (variable) => (variable.length <= MAX_VAR_LENGTH ? `{${variable}}` : `{${variable.substring(0, 6)}...}`);

function Item({ value, variable }) {
  return (
    <Container>
      <div>
        <Tooltip html={value}>{variable ? <VariableTag>{structureVar(value)}</VariableTag> : <span>{value}</span>}</Tooltip>
      </div>
    </Container>
  );
}

export default Item;
