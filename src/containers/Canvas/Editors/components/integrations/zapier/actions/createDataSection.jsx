import React, { Component } from 'react';
import { Collapse } from 'reactstrap';

import Button from '@/components/Button';

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
    const { completed: stateCompleted } = this.state;
    const { action_data } = this.props;
    let completed = false;
    if (!draftIsEmpty(action_data.value)) {
      completed = true;
    }
    if (completed !== stateCompleted) {
      this.setState({
        completed,
      });
    }
  }

  render() {
    const { completed } = this.state;
    const { toggleSection, open, action_data, variables, updateActionData, headers_loading, showNextSection } = this.props;
    return (
      <>
        <div className="d-flex flex-column section-title-container" onClick={() => toggleSection()}>
          <div className="integrations-section-title text-muted">
            With message
            {completed && <div className="completed-badge">&nbsp;&nbsp;&nbsp;&nbsp;</div>}
          </div>
        </div>
        <Collapse isOpen={open} className="w-100">
          <div className="d-flex flex-column mb-3">
            <div className="d-flex flex-row w-100 mb-3 align-items-center">
              <div className="d-flex flex-fill" style={{ overflow: 'auto' }}>
                <VariableText
                  className="form-control form-control auto-height"
                  raw={action_data.value}
                  variables={variables}
                  updateRaw={(raw) => {
                    updateActionData(
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
          {!headers_loading && (
            <div className="text-center my-3">
              <Button isFlat disabled={!completed} onClick={showNextSection}>
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
