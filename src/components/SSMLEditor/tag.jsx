import React from 'react';

function Tag(props) {
  const { block, contentState } = props;
  const key = block.getEntityAt(0);
  if (!key) return false;
  const entity = contentState.getEntity(key);
  const data = entity.getData();
  console.log(data);
  return (
    <div className={`tag mx-1 ${data.type}`}>
      {entity.type !== 'VOID' && `${data.key}:${data.otherKey}`}
      {entity.type !== 'CLOSE' && (
        <>
          {'< '}
          <strong>{data.type}</strong>
        </>
      )}
      {entity.type === 'VOID' && ' '}
      {entity.type !== 'OPEN' && '>'}
    </div>
  );
}

export default Tag;
