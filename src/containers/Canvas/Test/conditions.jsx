import React, { useState } from "react";
import _ from 'lodash'
import { compose } from "recompose";
import { connect } from "react-redux";
import cn from 'classnames'
import ConditionExpression from "./ConditionExpression";

const Conditions = (props) => {
  const {
    node,
    variables,
    testing_info,
    variableMapping,
    handleVariableChange,
  } = props

  return (
    <div id='Conditions' className={cn("mb-3", {
      'disabled': testing_info
    })}>
      <div className="text-center">
      {/* node.extras here */}
        {variables.map((block, i) => {
          return (
            <ConditionExpression
              key={i}
              variable={block}
              onRemove={_.noop}
              onSelection={handleVariableChange}
              onUpdate={_.noop}
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
