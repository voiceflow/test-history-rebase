import React, { useState } from "react";
import _ from 'lodash'
import { compose } from "recompose";
import { connect } from "react-redux";
import cn from 'classnames'
import SetExpression from "../Editors/components/SetExpression";

const Conditions = (props) => {
  const {
    node,
    variables,
    variableMapping,
    handleVariableChange,
  } = props

  return (
    <div id='Conditions' className="mb-3">
      <div className="text-center">
      {/* node.extras here */}
        {variables.map((block, i) => {
          return (
            <SetExpression
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
