import React, { Component } from "react";
import update from 'immutability-helper'
import { compose } from "recompose";
import { connect } from "react-redux";
import cn from 'classnames'
import { Collapse } from 'reactstrap'

import Conditions from './conditions'
import Timeline from './timeline'


import { setError } from "ducks/modal";

import C from './constants'

import './TestSidebar.css'
import './TestModal.css'

const SECTIONS = {
  [C.CONDITIONS]: Conditions,
  [C.TIMELINE]: Timeline
}

class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      variableMapping: props.variables.reduce((key, val) => {key[val]=val; return key}, {}),
      conditionsOpen: true,
      timelineOpen: false,
    }
  }

  toggleSection = section => {
    console.log('called toggle section', section)
    if (section === C.CONDITIONS) {
      this.setState(state => ({
        conditionsOpen: !state.conditionsOpen
      }))
    } else {
      this.setState(state => ({
        timelineOpen: !state.timelineOpen
      }))
    }
  }

  handleVariableChange = (variable, value) => {
    let newState = update(this.state, {
      variableMapping: {
        [variable]: {$set: value}
      }
    })
    this.setState(newState)
  }

  render() {
    const {
      conditionsOpen,
      timelineOpen
    } = this.state
    return (
      <div id="TestSidebar" className={cn({
        open: this.props.open
      })}>
        {Object.keys(SECTIONS).map((s, i) => {
          let section
          switch (s) {
            case C.CONDITIONS:
              section = <Conditions
                testing_info={this.props.testing_info}
                flow={this.props.flow}
                handleVariableChange={this.handleVariableChange}
                variableMapping={this.state.variableMapping}
              />

            break
            case C.TIMELINE: 
              section = <Timeline
                testing_info={this.props.testing_info}
                flow={this.props.flow}
                diagramEngine={this.props.diagramEngine}
                time={this.props.time}
                enterFlow={this.props.enterFlow}
                stop={this.props.stop}
                resume={this.props.resume}
                history={this.props.history}
                setTime={this.props.setTime}
                resetTest={this.props.resetTest}
                variableMapping={this.state.variableMapping}
              />
            break
            default:
              section = null
          }

          return <div key={i} className="mt-3 sidebar_container">
            <div className="condition-label" onClick={() => {this.toggleSection(s)}}>
            <label id={s} className='ml-3 mt-2 text-left'>{s}</label>
              {(s === C.CONDITIONS && !this.props.testing_info) && <i className={cn("fas", "light-grey", "d-flex", "align-items-center", {
                "fa-chevron-up": conditionsOpen,
                "fa-chevron-down":!conditionsOpen
              })} />
            }
            </div>
            <Collapse isOpen={s === C.CONDITIONS ? !this.props.testing_info && this.state.conditionsOpen : true}>
              {section}
            </Collapse>
            {s === C.CONDITIONS && <div className={cn("no-space__break", {
              'mt-3': !conditionsOpen || this.props.testing_info
            })} />}
          </div>
        })}
    </div>
    )
  }
}

const mapStateToProps = state => ({
  skill: state.skills.skill,
  diagram_id: state.skills.skill.diagram,
  variables: state.variables.localVariables.concat(state.skills.skill.global)
});

const mapDispatchToProps = dispatch => {
  return {
    setError: (err) => dispatch(setError(err))
  }
}
export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(Test);
