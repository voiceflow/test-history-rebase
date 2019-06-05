import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import cn from 'classnames'
import ConditionExpression from "./ConditionExpression";

const Conditions = (props) => {
  const {
    variables,
    testing_info,
    handleVariableChange,
  } = props

  return (
    <div id='Conditions' className={cn("mb-3", {
      'disabled': testing_info
    })}>
      <div className="text-center">
      {/* node.extras here */}
        {variables.map((variable, i) => {
          return (
            <ConditionExpression
              key={i}
              variable={variable}
              onSelection={handleVariableChange}
              variables={variables}
            />
          )
        })}
      </div>
  </div>
  )
}

const mapStateToProps = state => ({
  variables: state.variables.localVariables.concat(state.skills.skill.global)
});

export default compose(
  connect(mapStateToProps)
)(Conditions);
