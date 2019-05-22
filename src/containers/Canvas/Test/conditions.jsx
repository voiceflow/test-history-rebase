import React, { useState } from "react";
import _ from 'lodash'
import { compose } from "recompose";
import { connect } from "react-redux";
import cn from 'classnames'
import SetExpression from "../Editors/components/SetExpression";

const Conditions = (props) => {
  const {
    node,
    variables
  } = props
  const [mockData, setMockData] = useState([
    {
      expression: {
        depth: 0,
        type: "value",
        value: ""
      },
      variable: null
    }
  ])
  const handleSelection = (i, value) => {
    if (mockData[i].variable !== value) {
      mockData[i].variable = value;
      setMockData(mockData)
      console.log(mockData)
    }
  }

  return (
    <div id='Conditions' className="mb-3">
      <div className="text-center">
      {/* node.extras here */}
        {mockData.map((block, i) => {
          return (
            <SetExpression
              key={i}
              block={block}
              onRemove={_.noop}
              onSelection={(selected) => handleSelection(i, selected.value)}
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
