import update from 'immutability-helper';
import React, { Component } from 'react';
import { Collapse } from 'reactstrap';

import Button from '@/components/Button';
import { Spinner } from '@/components/Spinner';

import VariableInput from '../../../VariableInput';
import { draftIsEmpty } from '../../util';

// props
// action_data, open, headers_loading, sheet_headers, toggleSection, variables, showNextSection

class UpdateDataSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  checkCompletion = () => {
    let completed = false;
    const action_data = this.props.action_data;

    const row_values = action_data.row_values;
    if (row_values) {
      // eslint-disable-next-line no-restricted-syntax
      for (const v of row_values) {
        if (!draftIsEmpty(v)) {
          completed = !draftIsEmpty(action_data.row_number);
          break;
        }
      }
    }

    if (completed !== this.state.completed) {
      this.setState({
        completed,
      });
    }
  };

  componentDidMount() {
    this.checkCompletion();
  }

  render() {
    return (
      <>
        <div
          className={`d-flex flex-column section-title-container ${this.props.action_data.row_values ? '' : 'disabled'}`}
          onClick={() => this.props.toggleSection()}
        >
          <div className="integrations-section-title text-muted">
            With settings
            {this.state.completed && <div className="completed-badge">&nbsp;&nbsp;&nbsp;&nbsp;</div>}
          </div>
        </div>
        {this.props.action_data.row_values && (
          <Collapse isOpen={this.props.open} className="w-100">
            {!this.props.headers_loading && this.props.sheet_headers && (
              <div className="d-flex flex-column">
                <div className="d-flex flex-row w-100 align-items-center">
                  <div className="mr-2 text-muted" style={{ whiteSpace: 'nowrap' }}>
                    Row Number
                  </div>
                  <div className="d-flex flex-fill" style={{ overflow: 'auto' }}>
                    <VariableInput
                      className="form-control google-sheets-input"
                      raw={this.props.action_data.row_number}
                      variables={this.props.variables}
                      updateRaw={(raw) => {
                        this.props.updateActionData(
                          {
                            row_number: raw,
                          },
                          this.checkCompletion()
                        );
                      }}
                      placeholder="Row Number to Update"
                    />
                  </div>
                </div>
                <hr className="w-100" />

                {this.props.sheet_headers.map((header, i) => {
                  return (
                    <div key={i} className="d-flex flex-row w-100 mb-3 align-items-center">
                      <div
                        className="mr-2 text-muted"
                        style={{ whiteSpace: 'nowrap', maxWidth: '7em', textOverflow: 'ellipsis', overflow: 'hidden' }}
                      >
                        {header.label}
                      </div>
                      <div className="d-flex flex-fill" style={{ overflow: 'auto' }}>
                        <VariableInput
                          className="form-control google-sheets-input"
                          raw={this.props.action_data.row_values[i]}
                          variables={this.props.variables}
                          updateRaw={(raw) => {
                            this.props.updateActionData(
                              {
                                row_values: update(this.props.action_data.row_values, {
                                  [i]: {
                                    $set: raw,
                                  },
                                }),
                              },
                              this.checkCompletion()
                            );
                          }}
                          placeholder="Column Value to Update"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {!this.props.headers_loading && this.props.sheet_headers && this.props.sheet_headers.length === 0 && (
              <div className="text-center">No Sheet Headers Found</div>
            )}
            {this.props.headers_loading && <Spinner isEmpty />}
            {!this.props.headers_loading && (
              <div className="text-center my-3">
                <Button isPrimary disabled={!this.state.comploeted} onClick={this.props.showNextSection}>
                  Next
                </Button>
              </div>
            )}
          </Collapse>
        )}
      </>
    );
  }
}

export default UpdateDataSection;
