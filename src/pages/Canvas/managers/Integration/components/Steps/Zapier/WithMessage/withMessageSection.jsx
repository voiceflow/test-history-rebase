import React from 'react';

import VariablesInput from '@/components/VariablesInput';

import NextStepButton from '../../components/NextStepButton';

function WithMessageSection(props) {
  return (
    <>
      <VariablesInput
        value={props.data.value}
        onBlur={({ text }) => {
          props.onChange({
            value: text,
          });
        }}
        placeholder="Message"
      />
      <NextStepButton openNextStep={props.openNextStep} />
    </>
  );
}

export default WithMessageSection;
