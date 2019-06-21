import cn from 'classnames';
import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import ConditionExpression from './ConditionExpression';

const Conditions = (props) => {
  const [selectedVariables, setSelectedVariables] = useState(['']);
  const { variables, testing_info, handleVariableChange } = props;

  const setSelected = (idx, variable = null) => {
    if (variable) {
      setSelectedVariables((prev) => prev.splice(idx, 1, variable));
    } else {
      setSelectedVariables((prev) => prev.filter((_, i2) => i2 !== idx));
    }
  };

  const addVariable = () => {
    setSelectedVariables([...selectedVariables, '']);
  };

  return (
    <div
      id="Conditions"
      className={cn({
        disabled: testing_info,
      })}
    >
      <div className="text-center">
        {/* node.extras here */}
        {selectedVariables.map((variable, i) => {
          return (
            <ConditionExpression
              key={i}
              idx={i}
              first={i === 0}
              last={i === selectedVariables.length - 1}
              variable={variable}
              onSelection={handleVariableChange}
              addVariable={addVariable}
              setSelected={setSelected}
              variables={variables}
            />
          );
        })}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  variables: _.map(state.variables.localVariables.concat(state.skills.skill.global), (varMap) => {
    return {
      value: varMap,
      label: varMap,
    };
  }),
});

export default compose(connect(mapStateToProps))(Conditions);
