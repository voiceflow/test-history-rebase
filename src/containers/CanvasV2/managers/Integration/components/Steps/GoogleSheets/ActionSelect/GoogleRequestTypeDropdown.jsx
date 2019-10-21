import React from 'react';

import { IntegrationActionType } from '@/constants';

import SquareButton from '../../components/SquareButton';
import DropdownHeader from '../../components/StepDropdown';

function GoogleRequestType({ data, onChange, isOpened, toggle, openNextStep }) {
  const setRequestType = (requestType) => {
    onChange({ selectedAction: requestType });
    openNextStep();
  };

  return (
    <DropdownHeader headerText="I want to" headerSuffixText={data.selectedAction} isOpened={isOpened} toggle={toggle}>
      <SquareButton
        onClick={() => setRequestType(IntegrationActionType.GOOGLE_SHEETS.RETRIEVE_DATA)}
        text={IntegrationActionType.GOOGLE_SHEETS.RETRIEVE_DATA}
        tooltip="Retrieve a Single Row from a Spreadsheet"
      />
      <SquareButton
        onClick={() => setRequestType(IntegrationActionType.GOOGLE_SHEETS.CREATE_DATA)}
        text={IntegrationActionType.GOOGLE_SHEETS.CREATE_DATA}
        tooltip="Create a Row in a Spreadsheet"
      />
      <SquareButton
        onClick={() => setRequestType(IntegrationActionType.GOOGLE_SHEETS.UPDATE_DATA)}
        text={IntegrationActionType.GOOGLE_SHEETS.UPDATE_DATA}
        tooltip="Update an Existing Row in a Spreadsheet"
      />
      <SquareButton
        onClick={() => setRequestType(IntegrationActionType.GOOGLE_SHEETS.DELETE_DATA)}
        text={IntegrationActionType.GOOGLE_SHEETS.DELETE_DATA}
        tooltip="Delete Rows in a Spreadsheet"
      />
    </DropdownHeader>
  );
}

export default GoogleRequestType;
