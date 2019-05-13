import React, { Component } from 'react'
import { Collapse } from 'reactstrap'

import VariableInput from '../../../VariableInput';
import Button from 'components/Button'

import { draftIsEmpty } from '../../util'

// props
// action_data, open, toggleSection, showNextSection, variables, updateActionData

class CreateDataSection extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.checkCompletion()
  }

  checkCompletion = () => {
    let completed = false
    const action_data = this.props.action_data

    completed = !draftIsEmpty(action_data.start_row) && !draftIsEmpty(action_data.end_row)

    if (completed !== this.state.completed) {
      this.setState({
        completed: completed
      })
    }
  }

  render() {
    return (
      <>
        <div className={`d-flex flex-column section-title-container ${this.props.action_data.sheet ? '' : 'disabled'}`} onClick={() => this.props.toggleSection()}>
          <div className='integrations-section-title text-muted'>With settings
          {this.state.completed && <div className="completed-badge">&nbsp;&nbsp;&nbsp;&nbsp;</div>}
          </div>
        </div>
        <Collapse isOpen={this.props.open} className='w-100'>
          <div className='d-flex flex-column mb-3'>
            <div className='d-flex flex-row w-100 align-items-center mb-3'>
              <div className="mr-2" style={{ whiteSpace: "nowrap" }}>Start Row</div>
              <div className="d-flex flex-fill" style={{ overflow: "auto" }}>
                <VariableInput
                  className='form-control google-sheets-input'
                  raw={this.props.action_data.start_row}
                  variables={this.props.variables}
                  updateRaw={(raw) => {
                    this.props.updateActionData({
                      start_row: raw
                    }, this.checkCompletion())
                  }}
                  placeholder="Row Number to Start Delete"
                />
              </div>
            </div>
            <div className='d-flex flex-row w-100 align-items-center mb-3'>
              <div className="mr-2" style={{ whiteSpace: "nowrap" }}>End Row</div>
              <div className="d-flex flex-fill" style={{ overflow: "auto" }}>
                <VariableInput
                  className='form-control google-sheets-input'
                  raw={this.props.action_data.end_row}
                  variables={this.props.variables}
                  updateRaw={(raw) => {
                    this.props.updateActionData({
                      end_row: raw
                    }, this.checkCompletion())
                  }}
                  placeholder="Row Number to End Delete"
                />
              </div>
            </div>
          </div>
          <div className="text-center my-3">
            <Button isPrimary disabled={!this.state.completed} onClick={this.props.showNextSection}>
              Next
            </Button>
          </div>
        </Collapse>
      </>
    )
  }
}

export default CreateDataSection