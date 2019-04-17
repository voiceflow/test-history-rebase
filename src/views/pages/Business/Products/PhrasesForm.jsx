import _ from 'lodash';
import React from 'react';
import { Input, Button } from 'reactstrap';
import {Tooltip} from 'react-tippy';
import { AvForm } from 'availity-reactstrap-validation';

class PhrasesForm extends React.Component {
  render() {
      return (
          <div>
            <AvForm onValidSubmit={() => this.props.updateStage(3)}>
              <div>
                <label>
                    Phrases
                    &nbsp;
                    <Tooltip
                      target="tooltip"
                      className="menu-tip"
                      theme="menu"
                      position="bottom"
                      content={"ENTER HERE"}
                    >
                      <i className="fas fa-question-circle mr-1" id="tooltip"/>
                    </Tooltip>
                </label>
                {_.map(this.props.phrases, (phrase, idx) => {
                  return(
                    <div key={idx} className="super-center">
                      <Input className="form-bg mb-3"
                        placeholder="e.g. buy the science category"
                        value={phrase}
                        onChange={this.props.handleChange(idx)}
                      />
                      <button
                        type="button"
                        onClick={this.props.handleRemove(idx)}
                        className="btn-float mb-2 ml-2" style={{fontSize: '16px'}}
                      >
                      <i className="fal fa-times"></i>
                      </button>
                    </div>
                  );
                })}
              <div className="text-center">
                <button className='btn-tertiary-gray' onClick={this.props.handleAdd}>Add Phrase<i className="far fa-long-arrow-right ml-2"></i></button>
              </div>
            </div>
            <div className="product-stage-button">
              <button className="btn-tertiary-gray"
                variant="contained"
                onClick={() => this.props.updateStage(1)}
              >
                Previous
              </button>
              <button className="btn-primary ml-2"
                variant="contained"
              
              >
                Continue
              </button>
            </div>
          </AvForm>
        </div>
      );
  }
}

export default PhrasesForm;
