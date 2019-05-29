import React, { Component } from "react";
import _ from 'lodash'
import axios from 'axios'
import { compose } from "recompose";
import { connect } from "react-redux";
import cn from 'classnames'
import { UncontrolledCollapse } from 'reactstrap'

import Conditions from './conditions'
import Timeline from './timeline'


import { setError, setConfirm } from "ducks/modal";

import C from './constants'

import './TestSidebar.css'

const SECTIONS = {
  [C.CONDITIONS]: Conditions,
  [C.TIMELINE]: Timeline
}

class Test extends Component {
  constructor(props) {
    super(props)
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
              />

            break
            case C.TIMELINE: 
              section = <Timeline
                testing_info={this.props.testing_info}
                flow={this.props.flow}
                diagramEngine={this.props.diagramEngine}
                stop={this.props.stop}
                resume={this.props.resume}
              />
            break
            default:
              section = null
          }

          return <div key={i} className="mt-3 mb-3 sidebar_container">
            <label id={s} className='ml-3 mt-2' onClick={() => {this.setState({ open_section: s })}}>{s}</label>
            <UncontrolledCollapse toggler={`#${s}`}>
              {section}
            </UncontrolledCollapse>
          </div>
        })}
    </div>
    )
  }
}

const mapStateToProps = state => ({
  skill: state.skills.skill,
  diagram_id: state.skills.skill.diagram,
});

const mapDispatchToProps = dispatch => {
  return {
    setError: (err) => dispatch(setError(err))
  }
}
export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(Test);
