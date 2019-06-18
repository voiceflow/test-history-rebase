import Button from 'components/Button';
import React, { Component } from 'react';
import { Collapse } from 'reactstrap';

import VariableText from '../../../VariableText';
import { draftIsEmpty } from '../../util';

// props
// action_data, open, headers_loading, sheet_headers, toggleSection, variables, showNextSection

class CreateDataSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.checkCompletion();
  }

  checkCompletion() {
    let completed = false;
    const action_data = this.props.action_data;
    if (!draftIsEmpty(action_data.value)) {
      completed = true;
    }
    if (completed !== this.state.completed) {
      this.setState({
        completed,
      });
    }
  }

  render() {
    return (
      <>
        <div className="d-flex flex-column section-title-container" onClick={() => this.props.toggleSection()}>
          <div className="integrations-section-title text-muted">
            With message
            {this.state.completed && <div className="completed-badge">&nbsp;&nbsp;&nbsp;&nbsp;</div>}
          </div>
        </div>
        <Collapse isOpen={this.props.open} className="w-100">
          <div className="d-flex flex-column mb-3">
            <div className="d-flex flex-row w-100 mb-3 align-items-center">
              <div className="d-flex flex-fill" style={{ overflow: 'auto' }}>
                <VariableText
                  className="form-control form-control auto-height"
                  raw={this.props.action_data.value}
                  variables={this.props.variables}
                  updateRaw={(raw) => {
                    this.props.updateActionData(
                      {
                        value: raw,
                      },
                      this.checkCompletion()
                    );
                  }}
                  placeholder="Message"
                  silent={true}
                />
              </div>
            </div>
          </div>
          {!this.props.headers_loading && (
            <div className="text-center my-3">
              <Button isFlat disabled={!this.state.completed} onClick={this.props.showNextSection}>
                Next
              </Button>
            </div>
          )}
        </Collapse>
      </>
    );
  }
}

export default CreateDataSection;
