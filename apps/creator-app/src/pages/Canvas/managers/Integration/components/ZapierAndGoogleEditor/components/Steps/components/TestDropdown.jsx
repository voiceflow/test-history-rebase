import React from 'react';

import DropdownHeader from './StepDropdown';
import TestSection from './TestSection';

const TestDropdown = ({ data, onChange, isOpened, toggleStep }) => (
  <DropdownHeader headerText="Test Integration" isOpened={isOpened} toggle={toggleStep}>
    <TestSection data={data} onChange={onChange} />
  </DropdownHeader>
);

export default TestDropdown;
