import React from 'react';

import DropdownHeader from '../../components/StepDropdown';
import CreateUpdateDataSection from './CreateUpdateDataSection';

const WithValues = ({ data, onChange, headers_list, isOpened, toggle, openNextStep }) => (
  <DropdownHeader headerText="With Values" isOpened={isOpened} toggle={toggle}>
    <CreateUpdateDataSection openNextStep={openNextStep} sheet_headers={headers_list} data={data} onChange={onChange} />
  </DropdownHeader>
);

export default WithValues;
