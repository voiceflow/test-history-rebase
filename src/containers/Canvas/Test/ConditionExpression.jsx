import React from 'react';
import { Input } from 'reactstrap';

const ConditionExpression = (props) => {
  const { variable, onSelection } = props;

  return (
    <div className="mb-3 px-3">
      <div className="variable-group mb-2">
        <span>Set</span>
        <span className="action-visible variable-color">{`{${variable}}`}</span>
        <span>to:</span>
      </div>
      <Input type="text" placeholder={`{${variable}}`} onChange={(e) => onSelection(variable, e.target.value)} />
    </div>
  );
};
export default ConditionExpression;
