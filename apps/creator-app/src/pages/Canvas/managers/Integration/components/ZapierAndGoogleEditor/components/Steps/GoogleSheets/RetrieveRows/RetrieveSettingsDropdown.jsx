import React from 'react';

import DropdownHeader from '../../components/StepDropdown';
import RetrieveDataSection from './RetrieveDataSection';

const RetrieveSettings = ({ data, onChange, headers_list, isOpened, toggle, openNextStep }) => (
  <DropdownHeader headerText="With Settings" isOpened={isOpened} toggle={toggle}>
    <RetrieveDataSection openNextStep={openNextStep} headers_list={headers_list} data={data} onChange={onChange} />
  </DropdownHeader>
);

export default RetrieveSettings;
