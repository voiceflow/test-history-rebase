import React from 'react';

import DropdownHeader from '../../components/StepDropdown';
import SetupSection from './SetupSection';

const WithMessage = ({ data, onChange, apiKey, isOpened, toggleStep, openNextStep }) => (
  <DropdownHeader headerText="Zapier Setup" isOpened={isOpened} toggle={toggleStep}>
    <SetupSection openNextStep={openNextStep} apiKey={apiKey} data={data} onChange={onChange} />
  </DropdownHeader>
);

export default WithMessage;
