import React, { Component } from 'react'
import cn from 'classnames'
import { connect } from 'react-redux'
import { Collapse } from 'reactstrap'
import _ from 'lodash'
import OutputMapping from './outputMapping'
import { openTab } from 'actions/userActions'
import update from 'immutability-helper'

// props
// action_data, mapping_options, loading, variables, toggleSection, open, showNextSection
class OutputSection extends Component {

  constructor(props) {
    super(props)

    this.state = {}

    this.checkCompletion = this.checkCompletion.bind(this)

    this.handleAddMap = this.handleAddMap.bind(this)
    this.handleRemoveMap = this.handleRemoveMap.bind(this)
    this.handleSelection = this.handleSelection.bind(this)
  }

  componentDidMount() {
    if (!this.props.action_data.mapping) {
      this.props.updateActionData({
        mapping: []
      })
    }
    this.checkCompletion()
  }

  checkCompletion() {
    const mapping = this.props.action_data.mapping
    let completed = false
    if (mapping && mapping.length > 0 && _.find(mapping, (v) => !_.isNil(v.arg1) && !_.isNil(v.arg2))) {
      completed = true
    }

    if (completed !== this.state.completed) {
      this.setState({
        completed: completed
      })
    }
  }


  handleAddMap() {
    this.props.updateActionData({
      mapping: update(this.props.action_data.mapping, {
        $push: [{
          arg1: null,
          arg2: null
        }]
      })
    })
  }

  handleRemoveMap(i) {
    this.props.updateActionData({
      mapping: update(this.props.action_data.mapping, {
        $splice: [[i, 1]]
      })
    }, this.checkCompletion)
  }

  handleSelection(i, arg, value) {
    if (value !== 'Create Variable') {
      this.props.updateActionData({
        mapping: update(this.props.action_data.mapping, {
          [i]: {
            [arg]: {
              $set: value
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
          {this.props.mapping_options && this.props.action_data.mapping && !this.props.loading && <OutputMapping
            arg1_options={[{
              value: 'row_number',
              label: 'Row Number'
            }].concat(this.props.mapping_options)}
            arg2_options={this.props.variables}
            arguments={this.props.action_data.mapping}
            onAdd={() => this.handleAddMap()}
            onRemove={this.handleRemoveMap}
            handleSelection={(i, arg, value) => this.handleSelection(i, arg, value)}
          />}
          {this.props.loading && <div className="text-center my-4"><div className='loader text-lg' /></div>}
          <div className="text-center mt-3">
            <button
              className={cn('btn-tertiary-variable', {
                disabled: !this.state.completed
              })}
              onClick={this.props.showNextSection}
            >
              Next
            </button>
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

export default connect(null,mapDispatchToProps)(OutputSection)