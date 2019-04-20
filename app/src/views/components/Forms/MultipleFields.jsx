import _ from 'lodash';
import React from 'react';
import { Input } from 'reactstrap';
import {Tooltip} from 'react-tippy';
import { AvForm } from 'availity-reactstrap-validation';

 class MultipleFields extends React.Component {
  render() {
      return (
          <div>
            <AvForm>
              <div>
                <label>
                    {this.props.label}
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
                {_.map(this.props.fields, (field, idx) => {
                  return(
                    <div key={idx} className="super-center">
                      <Input className="form-bg mb-3"
                        placeholder={`Add ${this.props.label}`}
                        value={field}
                        onChange={(e) => this.props.handleChange(idx, e, this.props.type, this.props.fields)}
                      />
                      <button
                        type="button"
                        onClick={() => this.props.handleRemove(idx, this.props.type)}
                        className="btn-float mb-2 ml-2" style={{fontSize: '16px'}}
                      >
                      <i className="fal fa-times"></i>
                      </button>
                    </div>
                  );
                })}
              <div className="text-center">
                <button className='btn-tertiary-gray' onClick={() => this.props.handleAdd(this.props.type)}>Add {this.props.label}<i className="far fa-long-arrow-right ml-2"></i></button>
              </div>
            </div>
          </AvForm>
        </div>
      );
  }
}

 export default MultipleFields;
