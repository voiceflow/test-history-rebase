import React from 'react';

import ExpressionOperator from '@/components/ExpressionEditor/components/ExpressionOperator';
import OperatorDropdown from '@/components/ExpressionEditor/components/OperatorDropdown';

const OperatorButton = ({ onUpdateType, depth }) => (
  <OperatorDropdown update={onUpdateType} className="type-button" depth={depth}>
    <ExpressionOperator type="select" />
  </OperatorDropdown>
);

export default OperatorButton;
