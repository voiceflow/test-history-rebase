import React, { Component } from 'react'
import update from 'immutability-helper'
import cn from 'classnames'
import _ from 'lodash'
import randomstring from 'randomstring'
import { connect } from 'react-redux'
import { Collapse } from 'reactstrap'

import { openTab } from 'ducks/user'

import APIMapping from "../APIMapping";
import { draftIsEmpty } from './util'

import Button from 'components/Button'

// props
// action_data, mapping_options, loading, variables, toggleSection, open, showNextSection
class PathOutputSection extends Component {

  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this.checkCompletion()
  }

  componentDidUpdate() {
    this.checkCompletion()
  }

  checkCompletion = () => {
    const mapping = this.props.action_data.mapping
    let completed = false
    if (mapping && mapping.length > 0 && _.find(mapping, (v) => !draftIsEmpty(v.path) && v.var)) {
      completed = true
    }

    if (completed !== this.state.completed) {
      this.setState({
        completed: completed
      })
    }
  }

  handleAddPairMapping = () => {
    this.props.updateActionData({
      mapping: update(this.props.action_data.mapping, {
        $push: [{
          index: randomstring.generate(10),
          path: '',
          var: ''
        }]
      })
    })
  }

  handleRemovePairMapping = (i) => {
    this.props.updateActionData({
      mapping: update(this.props.action_data.mapping, {
        $splice: [[i, 1]]
      })
    }, this.checkCompletion)
  }

  handleKVMappingChange = (new_value, i, inputType) => {
    if (new_value !== 'Create Variable') {
      this.props.updateActionData({
        mapping: update(this.props.action_data.mapping, {
          [i]: {
            [inputType]: {
              $set: new_value
            }
          }
        })
      }, this.checkCompletion)
    } else {
      localStorage.setItem(
        "tab",
        "variables"
      );
      this.props.openVarTab("variables");
    }
  }

  render() {
    return (
      <>
        <div className="d-flex flex-column section-title-container" onClick={() => this.props.toggleSection()}>
          <div className='integrations-section-title text-muted'>Mapping output
            {this.state.completed && <div className="completed-badge">&nbsp;&nbsp;&nbsp;&nbsp;</div>}
          </div>
        </div>
        <Collapse isOpen={this.props.open} className='w-100 mb-4'>
          {this.props.action_data.mapping && <APIMapping
            pairs={this.props.action_data.mapping}
            onAdd={() => this.handleAddPairMapping()}
            onRemove={(e, i) => this.handleRemovePairMapping(i)}
            onChange={this.handleKVMappingChange}
            variables={this.props.variables}
          />}
          <div className="text-center mt-3">
            <Button
              isFlatVariable
              disabled={!this.state.completed}
              onClick={this.props.showNextSection}
            >
              Next
            </Button>
          </div>
        </Collapse>
      </>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    openVarTab: (tab) => dispatch(openTab(tab)),
  }
}

export default connect(null, mapDispatchToProps)(PathOutputSection)