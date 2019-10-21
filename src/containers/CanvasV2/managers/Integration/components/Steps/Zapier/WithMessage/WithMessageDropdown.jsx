import React from 'react';

import DropdownHeader from '../../components/StepDropdown';
import WithMessageSection from './withMessageSection';

function WithMessage({ data, onChange, isOpened, toggleStep, openNextStep }) {
  return (
    <DropdownHeader headerText="With Message" isOpened={isOpened} toggle={toggleStep}>
      <WithMessageSection openNextStep={openNextStep} data={data} onChange={onChange} />
    </DropdownHeader>
  );
}

export default WithMessage;
