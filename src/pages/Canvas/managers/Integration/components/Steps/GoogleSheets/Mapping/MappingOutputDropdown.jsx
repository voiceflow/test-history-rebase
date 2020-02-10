import React from 'react';

import DropdownHeader from '../../components/StepDropdown';
import MappingOutput from './MappingOutputSection';

function SheetsOutputMapping({ data, onChange, headers_list, isOpened, toggle, openNextStep }) {
  return (
    <DropdownHeader headerText="Mapping Output" isOpened={isOpened} toggle={toggle}>
      <MappingOutput openNextStep={openNextStep} headers_list={headers_list} data={data} onChange={onChange} />
    </DropdownHeader>
  );
}

export default SheetsOutputMapping;
