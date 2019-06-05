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
      conditionsOpen: false,
      timelineOpen: false,
    }
  }

  componentWillUnmount() {
    console.log('resetting here')
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
                variableMapping={this.state.variableMapping}
              />
            break
            default:
              section = null
          }

          return <div key={i} className="mt-3 mb-3 sidebar_container">
            <label id={s} className='ml-3 mt-2' onClick={() => {this.toggleSection(s)}}>{s}</label>
            <Collapse isOpen={s === C.CONDITIONS ? !this.props.testing_info && this.state.conditionsOpen: this.state.timelineOpen}>
              {section}
            </Collapse>
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
