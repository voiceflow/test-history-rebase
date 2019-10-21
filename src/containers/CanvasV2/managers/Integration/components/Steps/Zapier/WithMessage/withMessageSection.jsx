import React from 'react';

import VariableText from '@/components/VariableText';

import NextStepButton from '../../components/NextStepButton';

function WithMessageSection(props) {
  return (
    <>
      <VariableText
        className="form-control form-control auto-height"
        value={props.data.value}
        onChange={(val) => {
          props.onChange({
            value: val,
          });
        }}
        placeholder="Message"
        silent
      />
      <NextStepButton openNextStep={props.openNextStep} />
    </>
  );
}

export default WithMessageSection;
