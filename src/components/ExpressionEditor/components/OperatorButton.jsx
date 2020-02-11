import React from 'react';

import ExpressionOperator from '@/components/ExpressionEditor/components/ExpressionOperator';
import OperatorDropdown from '@/components/ExpressionEditor/components/OperatorDropdown';

function OperatorButton({ onUpdateType, depth }) {
  return (
    <OperatorDropdown update={onUpdateType} className="type-button" depth={depth}>
      <ExpressionOperator type="select" />
    </OperatorDropdown>
  );
}

export default OperatorButton;
