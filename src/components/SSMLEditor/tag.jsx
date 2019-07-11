import React from 'react';
import { Tooltip } from 'react-tippy';

import { makeDescription, makeETag } from './tagUtil';

function Tag(props) {
  const { block, contentState } = props;
  const key = block.getEntityAt(0);
  if (!key) return false;
  const entity = contentState.getEntity(key);
  const data = entity.getData();
  return (
    <Tooltip title={makeDescription(data)} position="top" disabled={entity.type === 'CLOSE'}>
      <div className={`tag mx-1 ${data.VF_type}`}>
        {(entity.type === 'OPEN' || entity.type === 'VOID') && '< '}
        {entity.type !== 'CLOSE' && makeETag(data)}
        {entity.type === 'VOID' && ' '}
        {(entity.type === 'VOID' || entity.type === 'CLOSE') && '>'}
      </div>
    </Tooltip>
  );
}

export default Tag;
