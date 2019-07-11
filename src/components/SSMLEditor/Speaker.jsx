import React from 'react';
import { Button } from 'reactstrap';

function Speaker(props) {
  const { className } = props;
  return (
    <div className={`d-inline-block ${className}`}>
      <Button>S</Button>
    </div>
  );
}

export default Speaker;
