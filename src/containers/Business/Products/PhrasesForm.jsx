import { AvForm } from 'availity-reactstrap-validation';
import Button from 'components/Button';
import _ from 'lodash';
import React from 'react';
import { Tooltip } from 'react-tippy';
import { Input } from 'reactstrap';

class PhrasesForm extends React.Component {
  render() {
    return (
      <div>
        <AvForm onValidSubmit={() => this.props.updateStage(3)}>
          <div>
            <label>
              Phrases &nbsp;
              <Tooltip target="tooltip" className="menu-tip" theme="menu" position="bottom" content="ENTER HERE">
                <i className="fas fa-question-circle mr-1" id="tooltip" />
              </Tooltip>
            </label>
            {_.map(this.props.phrases, (phrase, idx) => {
              return (
                <div key={idx} className="super-center">
                  <Input
                    className="form-bg mb-3"
                    placeholder="e.g. buy the science category"
                    value={phrase}
                    onChange={this.props.handleChange(idx)}
                    onKeyPress={(e) => {
                      if (e.charCode === 13) e.preventDefault();
                    }}
                  />
                  <Button isFloat onClick={this.props.handleRemove(idx)} className="mb-2 ml-2" style={{ fontSize: '16px' }}>
                    <i className="fal fa-times" />
                  </Button>
                </div>
              );
            })}
            <div className="text-center">
              <Button isFlatGray onClick={this.props.handleAdd}>
                Add Phrase
                <i className="far fa-long-arrow-right ml-2" />
              </Button>
            </div>
          </div>
          <div className="product-stage-button">
            <Button isFlatGray variant="contained" onClick={() => this.props.updateStage(1)}>
              Previous
            </Button>
            <Button isPrimary className="ml-2" variant="contained">
              Continue
            </Button>
          </div>
        </AvForm>
      </div>
    );
  }
}

export default PhrasesForm;
