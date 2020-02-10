import React from 'react';

import DropdownHeader from '../../components/StepDropdown';
import SetupSection from './SetupSection';

function WithMessage({ data, onChange, apiKey, isOpened, toggleStep, openNextStep }) {
  return (
    <DropdownHeader headerText="Zapier Setup" isOpened={isOpened} toggle={toggleStep}>
      <SetupSection openNextStep={openNextStep} apiKey={apiKey} data={data} onChange={onChange} />
    </DropdownHeader>
  );
}

export default WithMessage;
