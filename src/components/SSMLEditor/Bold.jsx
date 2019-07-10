import React from 'react';

function Bold(props) {
  const { offsetKey, className, children } = props;
  return (
    <span data-offset-key={offsetKey} className={className}>
      <strong>{children}</strong>
    </span>
  );
}

export default React.memo(Bold);
