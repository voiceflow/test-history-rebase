import React from 'react';

import DropdownHeader from '../../components/StepDropdown';
import DeleteDataSection from './DeleteSheets';

const DeleteSettings = ({ data, onChange, isOpened, toggle, openNextStep }) => (
  <DropdownHeader headerText="With Settings" isOpened={isOpened} toggle={toggle}>
    <DeleteDataSection openNextStep={openNextStep} data={data} onChange={onChange} />
  </DropdownHeader>
);

export default DeleteSettings;
