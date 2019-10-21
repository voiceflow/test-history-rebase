import React from 'react';

import DropdownHeader from '../../components/StepDropdown';
import SelectGoogleSheet from './SelectGoogleSheet';

function UsingGoogleSheet({ data, onChange, updateHeaders, isOpened, toggle, openNextStep }) {
  const sheetLabel = (data.sheet && data.sheet.label) || '';

  return (
    <DropdownHeader headerText="Using Sheet" headerSuffixText={sheetLabel} isOpened={isOpened} toggle={toggle}>
      <SelectGoogleSheet openNextStep={openNextStep} updateHeaders={updateHeaders} data={data} onChange={onChange} />
    </DropdownHeader>
  );
}

export default UsingGoogleSheet;
