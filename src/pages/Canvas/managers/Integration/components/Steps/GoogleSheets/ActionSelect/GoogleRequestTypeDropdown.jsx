import { GoogleSheetsActionType } from '@voiceflow/general-types/build/nodes/googleSheets';
import React from 'react';

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
        onClick={() => setRequestType(GoogleSheetsActionType.RETRIEVE_DATA)}
        text={GoogleSheetsActionType.RETRIEVE_DATA}
        tooltip="Retrieve a Single Row from a Spreadsheet"
      />
      <SquareButton
        onClick={() => setRequestType(GoogleSheetsActionType.CREATE_DATA)}
        text={GoogleSheetsActionType.CREATE_DATA}
        tooltip="Create a Row in a Spreadsheet"
      />
      <SquareButton
        onClick={() => setRequestType(GoogleSheetsActionType.UPDATE_DATA)}
        text={GoogleSheetsActionType.UPDATE_DATA}
        tooltip="Update an Existing Row in a Spreadsheet"
      />
      <SquareButton
        onClick={() => setRequestType(GoogleSheetsActionType.DELETE_DATA)}
        text={GoogleSheetsActionType.DELETE_DATA}
        tooltip="Delete Rows in a Spreadsheet"
      />
    </DropdownHeader>
  );
}

export default GoogleRequestType;
