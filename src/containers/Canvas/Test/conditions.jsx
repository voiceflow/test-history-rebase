import cn from 'classnames';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import ConditionExpression from './ConditionExpression';

const filter_variables = ['user_id', 'timestamp', 'platform', 'locale', 'access_token'];
const Conditions = (props) => {
  const { variables, testing_info, handleVariableChange } = props;

  return (
    <div
      id="Conditions"
      className={cn({
        disabled: testing_info,
      })}
    >
      <div className="no-space__break" />
      <div className="text-center">
        {/* node.extras here */}
        {_.difference(variables, filter_variables).map((variable, i) => {
          return <ConditionExpression key={i} variable={variable} onSelection={handleVariableChange} variables={variables} />;
        })}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  variables: state.variables.localVariables.concat(state.skills.skill.global),
});

export default compose(connect(mapStateToProps))(Conditions);
