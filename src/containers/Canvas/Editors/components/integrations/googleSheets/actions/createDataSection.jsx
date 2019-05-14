import React, { Component } from 'react'
import update from 'immutability-helper/index'
import { Collapse } from 'reactstrap'

import VariableInput from '../../../VariableInput'
import Button from 'components/Button'

import { draftIsEmpty } from '../../util'

// props
// action_data, open, headers_loading, sheet_headers, toggleSection, variables, showNextSection

class CreateDataSection extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.checkCompletion()
  }

  checkCompletion() {
    let completed = false
    const action_data = this.props.action_data

    const row_values = action_data.row_values
    if (row_values) {
      for (const v of row_values) {
        if (!draftIsEmpty(v)) {
          completed = true
          break
        }
      }
    }

    if (completed !== this.state.completed) {
      this.setState({
        completed: completed
      })
    }
  }

  render() {
    return (
      <>
        <div className={`d-flex flex-column section-title-container ${this.props.action_data.row_values ? '' : 'disabled'}`} onClick={() => this.props.toggleSection()}>
          <div className='integrations-section-title text-muted'>With values
          {this.state.completed && <div className="completed-badge">&nbsp;&nbsp;&nbsp;&nbsp;</div>}
          </div>
        </div>
        {this.props.action_data.row_values && <Collapse isOpen={this.props.open} className='w-100'>
          {!this.props.headers_loading && this.props.action_data.row_values && this.props.sheet_headers && this.props.sheet_headers.length > 0 && <div className='d-flex flex-column mb-3'>
            {this.props.sheet_headers.map((header, i) => {
              return <div key={i} className='d-flex flex-row w-100 mb-3 align-items-center'>
                <div className="mr-2 text-muted" style={{ whiteSpace: "nowrap", maxWidth: '7em', textOverflow: 'ellipsis', overflow: 'hidden' }}>{header.label}</div>
                <div className="d-flex flex-fill" style={{ overflow: "auto" }}>
                  <VariableInput
                    className='form-control google-sheets-input'
                    raw={this.props.action_data.row_values[i]}
                    variables={this.props.variables}
                    updateRaw={(raw) => {
                      this.props.updateActionData({
                        row_values: update(this.props.action_data.row_values, {
                          [i]: {
                            $set: raw
                          }
                        })
                      }, this.checkCompletion())
                    }}
                    placeholder="Column Value to Create"
                  />
                </div>
              </div>
            })}
          </div>}
          {!this.props.headers_loading && this.props.sheet_headers && this.props.sheet_headers.length === 0 && <div className="text-center">No Sheet Headers Found</div>}
          {this.props.headers_loading && <div className="text-center my-4"><div className='loader text-lg' /></div>}
          {!this.props.headers_loading && <div className="text-center my-3"><Button isFlat disabled={!this.state.completed} onClick={this.props.showNextSection}>Next</Button></div>}
        </Collapse>}
      </>
    )
  }
}

export default CreateDataSection
