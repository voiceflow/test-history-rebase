import React from 'react';

import VariablesInput from '@/componentsV2/VariablesInput';
import { styled } from '@/hocs';

import NextStepButton from '../../components/NextStepButton';

const LineItemContainer = styled.div`
  width: 100%;
  margin-bottom: 6px;
`;

const Label = styled.div`
  width: 120px;
  margin-right: 10px;
  display: inline-block;
  text-overflow: ellipsis;
`;

const ValueContainer = styled.div`
  display: inline-block;

  width: calc(100% - 130px);
`;

function DeleteSheets({ data, onChange, openNextStep }) {
  return (
    <>
      <div>
        <LineItemContainer>
          <Label>Start Row</Label>
          <ValueContainer>
            <VariablesInput value={data.start_row} onChange={({ text }) => onChange({ start_row: text })} placeholder="Row Number to Start Delete" />
          </ValueContainer>
        </LineItemContainer>
        <LineItemContainer>
          <Label>End Row</Label>
          <ValueContainer>
            <VariablesInput value={data.end_row} onBlur={({ text }) => onChange({ end_row: text })} placeholder="Row Number to End Delete" />
          </ValueContainer>
        </LineItemContainer>
      </div>
      <NextStepButton openNextStep={openNextStep} />
    </>
  );
}

export default DeleteSheets;
