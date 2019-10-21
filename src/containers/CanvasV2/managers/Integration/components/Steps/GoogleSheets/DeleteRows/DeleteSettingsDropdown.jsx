import React from 'react';

import DropdownHeader from '../../components/StepDropdown';
import DeleteDataSection from './DeleteSheets';

function DeleteSettings({ data, onChange, isOpened, toggle, openNextStep }) {
  return (
    <DropdownHeader headerText="With Settings" isOpened={isOpened} toggle={toggle}>
      <DeleteDataSection openNextStep={openNextStep} data={data} onChange={onChange} />
    </DropdownHeader>
  );
}

export default DeleteSettings;
