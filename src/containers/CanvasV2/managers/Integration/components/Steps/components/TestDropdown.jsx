import React from 'react';

import DropdownHeader from './StepDropdown';
import TestSection from './TestSection';

function TestDropdown({ data, onChange, isOpened, toggleStep }) {
  return (
    <DropdownHeader headerText="Test Integration" isOpened={isOpened} toggle={toggleStep}>
      <TestSection data={data} onChange={onChange} />
    </DropdownHeader>
  );
}

export default TestDropdown;
