import React from 'react';

function Tag(props) {
  const { block, contentState, blockProps } = props;
  const key = block.getEntityAt(0);
  if (!key) return false;
  const entity = contentState.getEntity(key);
  const data = entity.getData();
  return (
    <div className={`tag mx-1 ${data.type}`}>
      {entity.type !== 'VOID' && `${key}:${blockProps[key].otherKey}`}
      {(entity.type === 'OPEN' || entity.type === 'VOID') && '< '}
      {entity.type !== 'CLOSE' && data.type}
      {entity.type === 'VOID' && ' '}
      {(entity.type === 'VOID' || entity.type === 'CLOSE') && '>'}
    </div>
  );
}

export default Tag;
