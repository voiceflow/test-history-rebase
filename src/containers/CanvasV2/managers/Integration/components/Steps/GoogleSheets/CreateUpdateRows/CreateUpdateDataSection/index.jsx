import update from 'immutability-helper';
import React from 'react';

import VariableInput from '@/components/VariableInput';

import NextStepButton from '../../../components/NextStepButton';
import Label from './components/Label';
import LineItemContainer from './components/LineItemContainer';
import RowNumberContainer from './components/RowNumberContainer';
import ValueContainer from './components/ValueContainer';

class CreateUpdateDataSection extends React.PureComponent {
  render() {
    const { sheet_headers } = this.props;
    return (
      <>
        {this.props.data.row_values && sheet_headers && sheet_headers.length > 0 && (
          <>
            {this.props.data.selectedAction === 'Update Data' && (
              <RowNumberContainer>
                <Label>Row Number</Label>
                <ValueContainer>
                  <VariableInput
                    className="form-control"
                    value={this.props.data.row_number}
                    onChange={(val) => {
                      this.props.onChange({
                        row_number: val,
                      });
                    }}
                    placeholder="Row Number to Update"
                  />
                </ValueContainer>
              </RowNumberContainer>
            )}
            {sheet_headers.map((header, i) => {
              return (
                <LineItemContainer key={i}>
                  <Label>{header.label}</Label>
                  <ValueContainer>
                    <VariableInput
                      value={this.props.data.row_values[i]}
                      className="form-control"
                      onChange={(val) => {
                        this.props.onChange({
                          row_values: update(this.props.data.row_values, {
                            [i]: {
                              $set: val,
                            },
                          }),
                        });
                      }}
                      placeholder="Column Value to Create"
                    />
                  </ValueContainer>
                </LineItemContainer>
              );
            })}
          </>
        )}
        {sheet_headers && sheet_headers.length === 0 && <div className="text-center">No Sheet Headers Found</div>}
        <NextStepButton openNextStep={this.props.openNextStep} />
      </>
    );
  }
}

export default CreateUpdateDataSection;
