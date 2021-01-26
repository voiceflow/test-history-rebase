import React from 'react';

import DropdownHeader from '../../components/StepDropdown';
import WithMessageSection from './withMessageSection';

const WithMessage = ({ data, onChange, isOpened, toggleStep, openNextStep }) => (
  <DropdownHeader headerText="With Message" isOpened={isOpened} toggle={toggleStep}>
    <WithMessageSection openNextStep={openNextStep} data={data} onChange={onChange} />
  </DropdownHeader>
);

export default WithMessage;
