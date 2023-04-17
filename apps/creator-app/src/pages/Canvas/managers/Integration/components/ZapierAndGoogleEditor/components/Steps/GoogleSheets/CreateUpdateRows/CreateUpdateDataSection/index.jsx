import update from 'immutability-helper';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';

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
                  <VariablesInput
                    value={this.props.data.row_number}
                    onBlur={({ text }) => this.props.onChange({ row_number: text })}
                    placeholder="Row Number to Update"
                  />
                </ValueContainer>
              </RowNumberContainer>
            )}
            {sheet_headers.map((header, i) => (
              <LineItemContainer key={i}>
                <Label>{header.label}</Label>
                <ValueContainer>
                  <VariablesInput
                    value={this.props.data.row_values[i]}
                    onBlur={({ text }) => {
                      this.props.onChange({
                        row_values: update(this.props.data.row_values, { [i]: { $set: text } }),
                      });
                    }}
                    placeholder="Column Value to Create"
                  />
                </ValueContainer>
              </LineItemContainer>
            ))}
          </>
        )}
        {sheet_headers && sheet_headers.length === 0 && <div className="text-center">No Sheet Headers Found</div>}
        <NextStepButton openNextStep={this.props.openNextStep} />
      </>
    );
  }
}

export default CreateUpdateDataSection;
