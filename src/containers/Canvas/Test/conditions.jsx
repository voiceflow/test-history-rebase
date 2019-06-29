import cn from 'classnames';
import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';

import ConditionExpression from './ConditionExpression';

const Conditions = (props) => {
  const [selectedVariables, setSelectedVariables] = useState(['']);
  const { variableMapping, handleVariableChange } = props;

  const setSelected = (idx, variable = null) => {
    setSelectedVariables((prev) => (variable ? prev.splice(idx, 1, variable) : prev.filter((_, i2) => i2 !== idx)));
  };

  const addVariable = () => {
    setSelectedVariables([...selectedVariables, '']);
  };

  return (
    <div id="Conditions">
      <div className="text-center">
        {selectedVariables.map((variable, i) => {
          return (
            <ConditionExpression
              key={variable}
              idx={i}
              first={i === 0}
              last={i === selectedVariables.length - 1}
              variable={variable}
              onSelection={handleVariableChange}
              addVariable={addVariable}
              setSelected={setSelected}
              variables={Object.keys(variableMapping).map((variable) => ({ value: variable, label: variable }))}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Conditions;
