import React, { Component } from 'react'
import Select from 'react-select'
import { Collapse } from "reactstrap";
import { Tooltip } from "react-tippy";

import Button from 'components/Button'
import VariableInput from '../../../VariableInput'
import { selectStyles } from 'components/VariableSelect/VariableSelect'

// props
// action_data, integration_data, selected_action, updateActionData, integrationsUser, sheet_headers, headers_loading, updateHeaders, variables, showNextSection, open

class RetrieveData extends Component {

  constructor(props) {
    super(props)

    this.state = {}

    this.checkCompletion = this.checkCompletion.bind(this)
  }

  componentDidMount() {
    this.checkCompletion()
  }

  componentDidUpdate() {
    this.checkCompletion()
  }

  checkCompletion() {
    let completed = false
    const action_data = this.props.action_data

    if (action_data && action_data.spreadsheet && action_data.sheet && action_data.header_column) {
      completed = true
    }

    if (completed !== this.state.completed) {
      this.setState({
        completed: completed
      })
    }
  }

  render() {
    return (
      <div>
        <div className={`d-flex flex-column section-title-container ${this.props.action_data.sheet ? '' : 'disabled'}`} onClick={() => this.props.toggleSection()}>
          <div className='integrations-section-title text-muted'>With settings
          {this.state.completed && <div className="completed-badge">&nbsp;&nbsp;&nbsp;&nbsp;</div>}
          </div>
        </div>
        <Collapse isOpen={this.props.open} className='w-100'>
          <div className='d-flex align-items-center mb-4'>
            <div className="flex-1">
              <Select
                styles={selectStyles}
                classNamePrefix="google-sheets-dropdown select-box"
                options={this.props.sheet_headers ? [{
                  value: 'row_number',
                  label: 'Row Number'
                }].concat(this.props.sheet_headers) : this.props.sheet_headers}
                className='auth-dropdown'
                value={this.props.action_data.header_column}
                onChange={(v) => {
                  this.props.updateActionData({
                    header_column: v
                  }, this.checkCompletion())
                }}
                isLoading={this.props.headers_loading}
                placeholder="Column"
              />
            </div>
            <img src={'/equals.svg'} alt="comment" className="mr-2 ml-2" width='10px' />
            <div className='column-input' style={{ overflow: "auto", flex: '1 1' }}>
              <VariableInput
                key={JSON.stringify(!!this.props.action_data.match_value)}
                className='form-control google-sheets-input'
                raw={this.props.action_data.match_value || null}
                variables={this.props.variables}
                updateRaw={(raw) => {
                  this.props.updateActionData({
                    match_value: raw
                  })
                }}
                placeholder="Value to Match"
              />
            </div>
            <div><Tooltip
              className="menu-tip ml-2"
              title="The value to match in the selected column. Leaving this blank will select a random row in the spreadsheet"
              position="bottom"
              theme="block"
            >
              ?
              </Tooltip></div>
          </div>
          <div className="text-center my-3">
            <Button isFlat disabled={!this.state.completed} onClick={this.props.showNextSection}>
              Next
            </Button>
          </div>
        </Collapse>
      </div>
    )
  }
}

export default RetrieveData
