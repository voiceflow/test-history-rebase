import React from 'react';
import { Tooltip } from 'react-tippy';
import styled from 'styled-components';

import { makeDescription, makeETag } from './tagUtil';

const TagContainer = styled.div`
  color: ${({ type }) => {
    switch (type) {
      case 'BREAK':
        return '#132144';
      case 'VOLUME':
        return '#5891fb';
      case 'RATE':
        return '#f86683';
      case 'PITCH':
        return '#e29c42';
      case 'EMPHASIS':
        return '#36b4d2';
      case 'INTERPRETATION':
        return '#42b761';
      case 'PHONEME':
        return '#e760d4';
      case 'ALIAS':
        return '#26a69a';
      case 'WHISPER':
        return '#8da2b5';
      default:
        return '';
    }
  }};
`;

function Tag(props) {
  const { block, contentState } = props;
  const key = block.getEntityAt(0);
  if (!key) return false;
  const entity = contentState.getEntity(key);
  const data = entity.getData();
  return (
    <Tooltip title={makeDescription(data)} position="top" disabled={entity.type === 'CLOSE'}>
      <TagContainer type={data.VF_type}>
        {(entity.type === 'OPEN' || entity.type === 'VOID') && '< '}
        {entity.type !== 'CLOSE' && makeETag(data)}
        &nbsp;
        {(entity.type === 'VOID' || entity.type === 'CLOSE') && '>'}
      </TagContainer>
    </Tooltip>
  );
}

export default Tag;
